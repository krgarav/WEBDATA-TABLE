const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const { app } = require("electron");
dotenv.config({ path: app.getAppPath() + "/.env" });
const DB_name = "webdata";
const createDatabaseIfNotExists = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_name}`);
    console.log(`✅ Database "webdata" is ready.`);
    await connection.end();
  } catch (error) {
    console.error("❌ Error creating database:", error);
    process.exit(1); // Exit if DB creation fails
  }
};

module.exports = createDatabaseIfNotExists;
