const Assigndata = require("../../models/TempleteModel/assigndata");
const Templete = require("../../models/TempleteModel/templete");
const downloadMergedCsv = async (req, res) => {
  try {
    const taskId = req.params.id;
    const assigndata = await Assigndata.findByPk(taskId);
    const assignedcsvtable = assigndata.tableName;
    const templateId = assigndata.templeteId;
    const templete = await Templete.findByPk(templateId);
    const maintableName = templete.csvTableName;

    console.log(csvtable);
  } catch (error) {
    console.log(error);
  }
};
module.exports = downloadMergedCsv;
