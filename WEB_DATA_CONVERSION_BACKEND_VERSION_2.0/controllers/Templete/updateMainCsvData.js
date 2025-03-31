const Template = require("../../models/TempleteModel/templete");
const Assigndata = require("../../models/TempleteModel/assigndata");
const sequelize = require("../../utils/database");

const updateMainCsvData = async (req, res) => {
  try {
    const { templateId, parentId, updatedData, editedData, taskId } = req.body;

    // Fetch the template and get the table name
    const template = await Template.findByPk(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const assignedTask = await Assigndata.findByPk(taskId);
    const { tableName } = assignedTask;
    const result = Object.assign({}, ...editedData);
    // Step 1: Fetch existing Corrected data
    const [existingData] = await sequelize.query(
      `SELECT Corrected FROM ${tableName} WHERE parentId = :parentId`,
      {
        replacements: { parentId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Step 2: Parse existing data (handle null case)
    let correctedData = {};
    if (existingData?.Corrected) {
      try {
        correctedData = JSON.parse(existingData.Corrected);
      } catch (error) {
        console.error("Error parsing existing Corrected data:", error);
      }
    }

    // Step 3: Merge new data (existing values are updated, new ones added)
    const updatedCorrected = { ...correctedData, ...result };

    // Step 4: Update the database with merged data
    const query1 = `
  UPDATE ${tableName}
  SET Corrected_By = :email, Corrected = :updatedData
  WHERE parentId = :parentId
`;

    await sequelize.query(query1, {
      replacements: {
        email: req.user.email,
        parentId,
        updatedData: JSON.stringify(updatedCorrected),
      },
      type: sequelize.QueryTypes.UPDATE,
    });
    const csvTableName = template.csvTableName;

    // Build the query dynamically based on updatedData
    const setValues = Object.entries(updatedData)
      .map(([key, value]) => `\`${key}\` = :${key}`) // Named parameters for safety
      .join(", ");

    const query = `
            UPDATE ${csvTableName}
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
