const Assigndata = require("../../models/TempleteModel/assigndata");
const sequelize = require("../../utils/database");
const updateCurrentIndex = async (req, res) => {
  try {
    console.log("called");
    const { taskId, direction, parentId } = req.body;
    console.log(parentId);

    const assignData = await Assigndata.findByPk(taskId);
    if (!assignData) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { min, max, tableName } = assignData;
    const query = `SELECT COUNT(*) AS count FROM \`${tableName}\` `;

    const [countId] = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    const count = countId.count;
    // const [countResult] = await sequelize.query(
    //   `SELECT COUNT(*) AS count FROM ${tableName} `
    // );
    // const count = countResult[0].count;
    // console.log(assignData);
    let updated = false;

    if (direction === "next" && assignData.currentIndex < count) {
      assignData.currentIndex += 1;

      updated = true;
      const query1 = `
  UPDATE ${tableName}
  SET Corrected_By = :email
  WHERE parentId = :parentId
`;

      await sequelize.query(query1, {
        replacements: {
          email: req.user.email,
          parentId,
        },
        type: sequelize.QueryTypes.UPDATE,
      });
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
