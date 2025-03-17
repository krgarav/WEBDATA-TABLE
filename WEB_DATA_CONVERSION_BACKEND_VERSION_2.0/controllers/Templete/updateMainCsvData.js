const Template = require("../../models/TempleteModel/templete");
const Assigndata = require("../../models/TempleteModel/assigndata");
const sequelize = require("../../utils/database");

const updateMainCsvData = async (req, res) => {
  try {
    const { templateId, parentId, updatedData } = req.body;

    // Fetch the template and get the table name
    const template = await Template.findByPk(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const tableName = template.csvTableName;

    // Build the query dynamically based on updatedData
    const setValues = Object.entries(updatedData)
      .map(([key, value]) => `\`${key}\` = :${key}`) // Named parameters for safety
      .join(", ");

    const query = `
            UPDATE ${tableName}
            SET ${setValues}
            WHERE id = :parentId
        `;

    // Execute query with parameters
    await sequelize.query(query, {
      replacements: { ...updatedData, parentId },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Failed to update data", error });
  }
};

module.exports = updateMainCsvData;
