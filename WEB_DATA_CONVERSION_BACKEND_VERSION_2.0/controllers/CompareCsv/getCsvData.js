const Assigndata = require("../../models/TempleteModel/assigndata");
const sequelize = require("../../utils/database");
const { DataTypes, Op, QueryTypes } = require("sequelize");
const ErrorTable = require("../../models/CompareModel/ErrrorTable");
const ErrorAggregatedTable = require("../../models/CompareModel/ErrorAggregatedTable");

function groupByPrimaryKey(arr) {
  const grouped = {};

  arr.forEach((item) => {
    const primaryKey = item["PRIMARY"].trim();
    if (!grouped[primaryKey]) {
      grouped[primaryKey] = {
        PRIMARY_KEY: item["PRIMARY KEY"],
        IMAGE_NAME: item["IMAGE_NAME"],
        DATA: [],
      };
    }
    const dataItem = { ...item };
    delete dataItem["PRIMARY"];
    delete dataItem["PRIMARY KEY"];
    delete dataItem["IMAGE_NAME"];
    grouped[primaryKey].DATA.push(dataItem);
  });

  return Object.keys(grouped).map((key) => ({
    PRIMARY: key,
    PRIMARY_KEY: grouped[key].PRIMARY_KEY,
    IMAGE_NAME: grouped[key].IMAGE_NAME,
    DATA: grouped[key].DATA,
  }));
}

const getCsvData = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Fetch 'fileId' and 'currentIndex' in a single query
    const assignData = await Assigndata.findByPk(taskId, {
      attributes: ["fileId", "currentIndex"], // Only fetch necessary columns
    });

    if (!assignData) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { fileId, currentIndex } = assignData;

    // Fetch 'file' and 'errorCount' in a single query using COUNT()
    const [file, errorCount] = await Promise.all([
      ErrorTable.findOne({
        where: { fileId, indexTracker: currentIndex },
      }),
      ErrorTable.count({ where: { fileId } }), // Use COUNT instead of findAll
    ]);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Fetch columnData efficiently
    const columnData = await ErrorAggregatedTable.findAll({
      where: { errorTableId: file.id },
    });

    res.status(200).json({
      success: true,
      mainData: file,
      subData: columnData,
      errorCount, // Already counted
      currentIndex,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data." });
  }
};

module.exports = getCsvData;
