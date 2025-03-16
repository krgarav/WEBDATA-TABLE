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
    const assignData = await Assigndata.findByPk(taskId);
    const { fileId, currentIndex } = assignData;

    const file = await ErrorTable.findOne({
      where: { fileId: fileId, id: currentIndex },
    });

    const columnData = await ErrorAggregatedTable.findAll({
      where: { errorTableId: file.id },
    });

    // // Convert grouped JSON data back into an array
    // const formattedResult = result.map((row) => ({
    //   ...row,
    //   DATA: row.DATA ? JSON.parse(`[${row.DATA}]`) : [],
    // }));

    res.json({ file,columnData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data." });
  }
};

module.exports = getCsvData;
