const Sequelize = require("sequelize");

const sequelize = require("../../utils/database");

const Files = sequelize.define("filedata", {
  csvFileTable: {
    type: Sequelize.STRING,
    defaultValue: null,
  },
  csvFile: {
    type: Sequelize.STRING,
    defaultValue: null,
  },

  zipFile: {
    type: Sequelize.STRING,
    defaultValue: null,
  },
  totalFiles: {
    type: Sequelize.STRING,
    defaultValue: null,
  },
});

module.exports = Files;
