const Template = require("../../models/TempleteModel/templete");
const Assigndata = require("../../models/TempleteModel/assigndata");
const sequelize = require("../../utils/database");
const MappedData = require("../../models/TempleteModel/mappedData");
const MetaData = require("../../models/TempleteModel/metadata");
const { QueryTypes, Op } = require("sequelize");
const path = require("path");
const FileData = require("../../models/TempleteModel/files");

const getCsvTableData = async (req, res) => {
  try {
    // const { id } = req.body.taskData;
    // const assignedData = await Assigndata.findOne({ where: { id } });

    // if (!assignedData) {
    //   return res.status(404).json({ error: "Assigned data not found" });
    // }

    // const { templeteId, min, max, currentIndex } = assignedData;
    // const template = await Template.findByPk(templeteId);

    // if (!template) {
    //   return res.status(404).json({ error: "Template not found" });
    // }
    // const { patternDefinition, blankDefination, csvTableName } = template;
    // const columns = await MappedData.findAll({
    //     where: {
    //       templeteId: templeteId,
    //       value: { [Op.ne]: null } // Ensures 'value' is NOT null
    //     },
    //     attributes: ["key","value"] // Include specific attributes
    //   });
    //   const metaData = await MetaData.findAll({
    //     where: {
    //       templeteId: templeteId,
    //     }
    //   });

    //   const FormCol = [];
    //   const QuestionCol = [];
    //   for(let i=0 ; i<columns.length;i++){
    //       for(let j=0;j<metaData.length;j++){
    //         if(columns[i].value===metaData[j].attribute && metaData[j].fieldType==="formField"){
    //           FormCol.push(columns[i].key)
    //         }
    //       }
    //   }

    //   for(let i=0 ; i<columns.length;i++){
    //     for(let j=0;j<metaData.length;j++){
    //       if(columns[i].value===metaData[j].attribute && metaData[j].fieldType==="questionsField"){
    //         QuestionCol.push(columns[i].key)
    //       }
    //     }
    // }

    // if (!columns.length) {
    //   return res.status(404).json({ error: "No relevant columns found" });
    // }

    // const columnNames = columns.map((col) => `\`${col.key}\``);

    // // Step 2: Build dynamic WHERE conditions using extracted columns
    // const conditions = columnNames
    //   .map((col) => `${col} = :patternDefinition OR ${col} = :blankDefination`)
    //   .join(" OR ");

    // // Step 3: Construct the query
    // const query = `
    //     SELECT * FROM \`${csvTableName}\`
    //     WHERE id BETWEEN :min AND :max
    //     AND (
    //       ${conditions}
    //     )
    //   `;

    // const filteredData = await sequelize.query(query, {
    //   replacements: {
    //     min: Number(min),
    //     max: Number(max),
    //     patternDefinition,
    //     blankDefination,
    //   },
    //   type: sequelize.QueryTypes.SELECT,
    // });

    // if (!filteredData.length) {
    //   return res.status(404).json({ error: "No matching data found" });
    // }

    // return res
    //   .status(200)
    //   .json({
    //     formdata: filteredData[currentIndex - 1],
    //     questionData:
    //     total_error: filteredData.length,
    //     FormCol,QuestionCol
    //   });
    // const [columns] = await sequelize.query(
    //   `SHOW COLUMNS FROM \`${csvTableName}\``
    // );
    // const columnNames = columns.map((col) => `\`${col.Field}\``).join(", ");

    // Step 2: Build dynamic WHERE clause to search in all columns
    // const conditions = columns
    //   .map(
    //     (col) =>
    //       `\`${col.Field}\` = :patternDefinition OR \`${col.Field}\` = :blankDefination`
    //   )
    //   .join(" OR ");

    // Step 3: Construct the query
    // const query = `
    //   SELECT * FROM \`${csvTableName}\`
    //   WHERE id BETWEEN :min AND :max
    //   AND (
    //     ${conditions}
    //   )
    // `;

    // const filteredData = await sequelize.query(query, {
    //   replacements: {
    //     min: Number(min),
    //     max: Number(max),
    //     patternDefinition,
    //     blankDefination,
    //   },
    //   type: sequelize.QueryTypes.SELECT,
    // });

    // if (!filteredData.length) {
    //   return res.status(404).json({ error: "No matching data found" });
    // }

    // return res
    //   .status(200)
    //   .json({ data: filteredData, total_error: filteredData.length });
    const { id } = req.body.taskData;
    const assignedData = await Assigndata.findOne({ where: { id } });

    if (!assignedData) {
      return res.status(404).json({ error: "Assigned data not found" });
    }

    const { templeteId, min, max, currentIndex, fileId } = assignedData;
    const fileName = await FileData.findByPk(fileId);
    const template = await Template.findByPk(templeteId);

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    const { patternDefinition, blankDefination, csvTableName, imageColName } =
      template;

    const columns = await MappedData.findAll({
      where: {
        templeteId: templeteId,
        value: { [Op.ne]: null },
      },
      attributes: ["key", "value"],
    });

    const metaData = await MetaData.findAll({
      where: {
        templeteId: templeteId,
      },
    });

    // Optimized column filtering
    const formFieldValues = new Set(
      metaData
        .filter((meta) => meta.fieldType === "formField")
        .map((meta) => meta.attribute)
    );

    const questionFieldValues = new Set(
      metaData
        .filter((meta) => meta.fieldType === "questionsField")
        .map((meta) => meta.attribute)
    );

    const FormCol = columns
      .filter((col) => formFieldValues.has(col.value))
      .map((col) => col.key);

    const QuestionCol = columns
      .filter((col) => questionFieldValues.has(col.value))
      .map((col) => col.key);

    if (!columns.length) {
      return res.status(404).json({ error: "No relevant columns found" });
    }

    const columnNames = columns.map((col) => `\`${col.key}\``);

    const conditions = columnNames
      .map((col) => `${col} = :patternDefinition OR ${col} = :blankDefination`)
      .join(" OR ");

    const query = `
    SELECT * FROM \`${csvTableName}\`
    WHERE id BETWEEN :min AND :max
    AND (
      ${conditions}
    )
  `;

    const filteredData = await sequelize.query(query, {
      replacements: {
        min: Number(min),
        max: Number(max),
        patternDefinition,
        blankDefination,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!filteredData.length) {
      return res.status(404).json({ error: "No matching data found" });
    }

    // Split data into formData and questionData
    const formData = {};
    const questionData = {};
    const primaryId = filteredData[currentIndex - 1].id;
    const imageName = filteredData[currentIndex - 1][imageColName];
    const baseName = path.basename(imageName);
    Object.entries(filteredData[currentIndex - 1]).forEach(([key, value]) => {
      if (FormCol.includes(key)) {
        formData[key] = value;
      }
      if (QuestionCol.includes(key)) {
        questionData[key] = value;
      }
    });

    return res.status(200).json({
      formdata: formData,
      questionData: questionData,
      total_error: filteredData.length,
      imageName: path.join(fileName.zipFile, baseName),
      currentIndex: currentIndex,
      id: primaryId,
    });
  } catch (error) {
    console.error("Error fetching CSV table data:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error", error });
  }
};

module.exports = getCsvTableData;
