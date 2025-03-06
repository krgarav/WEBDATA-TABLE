const Templete = require("../../models/TempleteModel/templete");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const { QueryTypes } = require("sequelize");

exports.updateDuplicate = async (req, res) => {
  try {
    const { templateId, rowId } = req.query;
    const updatedData = req.body;

    if (!templateId || !rowId || Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Template ID, Row ID, and updated data are required",
      });
    }

    console.log("Updating template ID:", templateId);
    console.log("Row ID:", rowId);
    console.log("New Data:", updatedData);

    // 1️⃣ Get the table name from the template
    const template = await Templete.findByPk(templateId);
    if (!template || !template.mergedTableName) {
      return res.status(404).json({
        success: false,
        message: "Template or associated table not found",
      });
    }

    const tableName = template.mergedTableName;

    const filteredData = {};
    Object.keys(updatedData).forEach((key) => {
      const safeKey = key.replace(/\s+/g, "_").replace(/\./g, "_"); // Convert spaces & dots to underscores
      filteredData[safeKey] = updatedData[key];
    });

    const setClause = Object.keys(updatedData)
      .map(
        (key) =>
          `\`${key.replace(/`/g, "``")}\` = :${key
            .replace(/\s+/g, "_")
            .replace(/\./g, "_")}`
      ) // Properly escape column names
      .join(", ");

    const updateQuery = `
      UPDATE \`${tableName}\`
      SET ${setClause}
      WHERE id = :rowId
    `;

    await sequelize.query(updateQuery, {
      replacements: { rowId, ...filteredData }, // Use safe keys
      type: QueryTypes.UPDATE,
    });

    res.json({
      success: true,
      message: `Row in '${tableName}' updated successfully`,
    });
  } catch (error) {
    console.error("Error updating row:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteDuplicate = async (req, res) => {
  try {
    const templateId = +req.query.templateId; // Converts to a number
    const rowId = +req.query.rowId; // Converts to a number
    // Assuming you send data in body
    console.log(req.query);
    if (!templateId || !rowId) {
      return res
        .status(400)
        .json({ message: "templateId and rowId are required" });
    }

    // Fetch template to get associated table name
    const template = await Templete.findByPk(templateId);
    if (!template || !template.mergedTableName) {
      return res.status(404).json({
        success: false,
        message: "Template or associated table not found",
      });
    }

    const tableName = template.mergedTableName.trim(); // Trim any spaces

    if (!tableName) {
      return res.status(400).json({ message: "Invalid table name" });
    }

    // Use a parameterized query with dynamic table name
    const deleteQuery = `
      DELETE FROM \`${tableName}\`
      WHERE id = :rowId
    `;

    const result = await sequelize.query(deleteQuery, {
      replacements: { templateId, rowId },
      type: QueryTypes.DELETE,
    });

    res.status(200).json({
      message: "Duplicate entries deleted successfully",
      affectedRows: result[1], // Number of deleted rows
    });
  } catch (error) {
    console.error("Error deleting duplicates:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
