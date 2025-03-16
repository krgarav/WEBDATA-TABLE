const Assigndata = require("../../models/TempleteModel/assigndata");
const sequelize = require("../../utils/database");
const updateCurrentIndex = async (req, res) => {
  try {
    const { taskId, direction } = req.body;

    const assignData = await Assigndata.findByPk(taskId);
    if (!assignData) {
      return res.status(404).json({ error: "Task not found" });
    }
    const tableName = assignData.tableName;

    const [countResult] = await sequelize.query(
      `SELECT COUNT(*) AS count FROM ${tableName} `
    );
    const count = countResult[0].count;

    let updated = false;

    if (direction === "next" && assignData.currentIndex < count) {
      assignData.currentIndex += 1;
      updated = true;
    } else if (direction === "prev" && assignData.currentIndex > 1) {
      assignData.currentIndex -= 1;
      updated = true;
    }

    if (updated) {
      await assignData.save();
      res.json({
        message: "Index updated successfully",
        currentIndex: assignData.currentIndex,
      });
    } else {
      const message =
        direction === "next"
          ? "You have reached the last page."
          : "You are already on the first page.";
      res.status(400).json({ message });
    }
  } catch (error) {
    console.error("Error updating index:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = updateCurrentIndex;
