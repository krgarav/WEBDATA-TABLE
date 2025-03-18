const Sequelize = require("sequelize");

const sequelize = require("../../utils/database");

const ErrorTable = require("./ErrrorTable");
const ErrorAggregatedTable = sequelize.define("errorAggregated", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Column_Name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  File_1_data: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  File_2_data: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  errorTableId: {
    type: Sequelize.INTEGER,
    references: {
      model: ErrorTable,
      key: "id",
    },
    onDelete: "CASCADE", // Ensures entries are deleted if the parent is deleted
    onUpdate: "CASCADE",
  },
  Corrected: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  CorrectedBy: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = ErrorAggregatedTable;
