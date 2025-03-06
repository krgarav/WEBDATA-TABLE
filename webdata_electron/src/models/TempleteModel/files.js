const Sequelize = require("sequelize");


const sequelize = require("../../utils/database");

const Files = sequelize.define("filedata", {
  csvFile: {
    type: Sequelize.STRING,
    defaultValue: null,
  },

  zipFile: {
    type: Sequelize.STRING,
    defaultValue: null,
  },
});

module.exports = Files;
