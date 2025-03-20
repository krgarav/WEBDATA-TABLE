const Assigndata = require("../../models/TempleteModel/assigndata");
const Templete = require("../../models/TempleteModel/templete");
const { Parser } = require("json2csv"); // For converting JSON to CSV
const sequelize = require("../../utils/database");
const downloadMergedCsv = async (req, res) => {
  try {
    const taskId = req.params.id;
    const assigndata = await Assigndata.findByPk(taskId);

    if (!assigndata) {
      return res.status(404).json({ error: "Assignment data not found" });
    }

    const assignedcsvtable = assigndata.tableName;
    const templateId = assigndata.templeteId;
    const templete = await Templete.findByPk(templateId);

    if (!templete) {
      return res.status(404).json({ error: "Template not found" });
    }

    const maintableName = templete.csvTableName;
    // Get table columns dynamically
    const [columns] = await sequelize.query(
      `SHOW COLUMNS FROM ${maintableName}`
    );
    const columnNames = columns
      .map((col) => `\`${col.Field}\``) // Add backticks to each column name
      .filter((col) => col !== "`id`") // Exclude 'id' column if needed
      .join(", ");

    // Use the filtered column list in the query
    const query = `SELECT ${columnNames} FROM ${maintableName}`;
    const data = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    // Use Sequelize's `query` method for dynamic table access
    // const query =  `SELECT * FROM ${maintableName} WHERE id IS NULL OR id IS NOT NULL`;;
    // const data = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ error: "No data available in the main table" });
    }

    // Convert JSON data to CSV
    const json2csvParser = new Parser();
    const csvData = json2csvParser.parse(data);

    // Set response headers for CSV download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${maintableName}.csv`
    );
    res.setHeader("Content-Type", "text/csv");

    res.send(csvData);
  } catch (error) {
    console.error("Error downloading CSV:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = downloadMergedCsv;
