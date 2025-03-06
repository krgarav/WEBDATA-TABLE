const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");
const csvParser = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");

try {
    console.log("Worker started with data:", workerData);

    const { originalFilePath, errorFilePath, correctedCsvFilePath, updates, email } = workerData;

    if (!fs.existsSync(originalFilePath)) throw new Error(`File not found: ${originalFilePath}`);
    if (!fs.existsSync(errorFilePath)) throw new Error(`File not found: ${errorFilePath}`);

    const jsonData = [];
    const errorJsonFile = [];

    const readCsvFile = (filePath) => {
        return new Promise((resolve, reject) => {
            const rows = [];
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on("data", (data) => rows.push(data))
                .on("end", () => resolve(rows))
                .on("error", (err) => reject(`Error reading CSV ${filePath}: ${err.message}`));
        });
    };

    (async () => {
        try {
            const jsonData = await readCsvFile(originalFilePath);
            const errorJsonFile = await readCsvFile(errorFilePath);

            console.log("Original CSV Data:", jsonData.length, "rows");
            console.log("Error CSV Data:", errorJsonFile.length, "rows");

            if (!jsonData.length) throw new Error("Original CSV is empty!");
            if (!errorJsonFile.length) throw new Error("Error CSV is empty!");

            const updatedErrorJsonFile = errorJsonFile.map((item) => {
                updates.forEach(({ PRIMARY, COLUMN_NAME, CORRECTED }) => {
                    if (item.PRIMARY.trim() === PRIMARY.trim() && item.COLUMN_NAME.trim() === COLUMN_NAME.trim()) {
                        item.CORRECTED = CORRECTED;
                        item["CORRECTED BY"] = email;
                    }
                });
                return item;
            });

            const jsonDataMap = new Map(jsonData.map((item) => [item["PRIMARY KEY"], item]));

            updatedErrorJsonFile.forEach((errorRow) => {
                const primaryKey = errorRow["PRIMARY"];
                const columnName = errorRow["COLUMN_NAME"];
                const correctedValue = errorRow["CORRECTED"];
                const correctedBy = errorRow["CORRECTED BY"] || "Unknown";

                let findVar = jsonDataMap.get(primaryKey.trim());
                if (findVar) {
                    findVar[columnName] = correctedValue;
                    if (correctedValue) {
                        findVar["Corrected Data"] = findVar["Corrected Data"]
                            ? findVar["Corrected Data"] + `, ${columnName}: ${correctedValue}`
                            : `${columnName}: ${correctedValue}`;
                        findVar["Corrected By"] = correctedBy;
                    }
                }
            });

            const writeCsvFile = (filePath, data) => {
                return new Promise((resolve, reject) => {
                    if (data.length === 0) {
                        return reject(new Error(`No data to write to ${filePath}`));
                    }

                    const csvWriter = createObjectCsvWriter({
                        path: filePath,
                        header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
                    });

                    csvWriter.writeRecords(data).then(resolve).catch(reject);
                });
            };

            await writeCsvFile(correctedCsvFilePath, Array.from(jsonDataMap.values()));
            await writeCsvFile(errorFilePath, updatedErrorJsonFile);

            console.log("✅ Task completed successfully!");
            parentPort.postMessage({ success: true, message: "Task updated successfully" });
        } catch (error) {
            console.error("❌ Worker Error:", error);
            parentPort.postMessage({ success: false, error: error.message });
            process.exit(1);
        }
    })();
} catch (error) {
    console.error("❌ Worker Initialization Error:", error);
    parentPort.postMessage({ success: false, error: error.message });
    process.exit(1);
}
