const Template = require("../../models/TempleteModel/templete");
const Assigndata = require("../../models/TempleteModel/assigndata");
const getRowData = async (req, res) => {
  try {
    const { taskId, rowId } = req.query;
    const assignData = await Assigndata.findByPk(taskId);
    const { templeteId } = assignData;
    const template = await Template.findByPk(templeteId);

    const TableName = template.csvTableName;

    const query = `SELECT * FROM ${TableName} WHERE id = :rowId`;
    const row = await sequelize.query(query, {
      replacements: { rowId },
      type: QueryTypes.SELECT,
    });
    res.status(200).json({ success: true, data: row });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch data." });
  }
};
module.exports = getRowData;
