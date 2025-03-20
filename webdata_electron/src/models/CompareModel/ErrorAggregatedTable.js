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

  Corrected: {
    type: Sequelize.STRING,
    
  },
  CorrectedBy: {
    type: Sequelize.STRING,

  },
  errorTableId: {
    type: Sequelize.INTEGER,
    references: {
      model: ErrorTable,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
 
});

module.exports = ErrorAggregatedTable;
