// const Sequelize = require("sequelize");
const { app } = require("electron");
const dotenv = require("dotenv");
dotenv.config({ path: app.getAppPath() + "/.env" });
// const sequelize = new Sequelize("omrusermanagement", "root", "12345678", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;

// const Sequelize = require("sequelize");

// const sequelize = new Sequelize("omrscannerduplex", "root", "root", {
//   dialect: "mysql",
//   host: "localhost",
// });
const Sequelize = require("sequelize");
// Function to ensure the database exists
// exports.createDatabaseIfNotExists = async () => {
//   try {
//     const connection = await mysql.createConnection({
//       host: "localhost",
//       user: "root",
//       password: "root",
//     });

//     await connection.query(`CREATE DATABASE IF NOT EXISTS webdata}`);
//     console.log(`✅ Database "webdata" is ready.`);
//     await connection.end();
//   } catch (error) {
//     console.error("❌ Error creating database:", error);
//     process.exit(1); // Exit if DB creation fails
//   }
// };
const sequelize = new Sequelize("webdataconversion_2", "root", "root", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
  timezone: "+05:30",
});

// const sequelize = new Sequelize(process.env.SQL_DATABASE_NAME, process.env.SQL_USER, process.env.SQL_PASS, {
//   dialect: "mysql",
//   host: "localhost",
//   logging: false,
//   timezone: "+05:30",
// });

module.exports = sequelize;
