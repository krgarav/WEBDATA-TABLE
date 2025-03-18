const Assigndata = require("../../models/TempleteModel/assigndata");

const updateCurrentIndex = async (req, res) => {
  try {
    const { taskId, direction } = req.body;

    const assignData = await Assigndata.findByPk(taskId);

    // Handle case where taskId doesn't exist
    if (!assignData) {
      return res.status(404).json({ error: "Task not found" });
    }
    let newIndex=assignData.currentIndex;
    if (direction === "next") {
      newIndex = newIndex + 1;
    } else if (direction === "prev") {
      newIndex = newIndex - 1;
    }
    assignData.currentIndex = newIndex;
    await assignData.save();

    res.status(200).json({
      message: "Index updated successfully",
      updatedIndex: assignData.currentIndex,
    });
  } catch (error) {
    console.error("Error updating index:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = updateCurrentIndex;
