const Template = require("../../models/TempleteModel/templete");
const Assigndata = require("../../models/TempleteModel/assigndata");
const sequelize = require("../../utils/database");
const { DataTypes, Op, QueryTypes } = require("sequelize");
const path = require("path");
const getRowData = async (req, res) => {
  try {
    const { taskId, rowId } = req.query;
    const assignData = await Assigndata.findByPk(taskId);
    const { templeteId, imageDirectoryPath } = assignData;
    const template = await Template.findByPk(templeteId);

    const TableName = template.csvTableName;
    const ImageColName = template.imageColName;
    const query = `SELECT * FROM ${TableName} WHERE id = :rowId`;
    const [row] = await sequelize.query(query, {
      replacements: { rowId },
      type: QueryTypes.SELECT,
    });
    const imageName = path.basename(row[ImageColName]);
    const imageUrl = path.join(imageDirectoryPath, imageName);
    res.status(200).json({ success: true, data: row, imageUrl: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch data." });
  }
};
module.exports = getRowData;
