const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const extract = require("extract-zip");

const mysqlZipPath = path.join(__dirname, "mysql.zip"); // MySQL ZIP file path
const extractPath = "C:\\mysql"; // Folder where MySQL will be extracted
const extractedFolderName = "mysql-8.4.4-winx64"; // Folder inside ZIP
const mysqlBasePath = path.join(extractPath, extractedFolderName); // Full path to extracted MySQL
const mysqlBinPath = path.join(mysqlBasePath, "bin", "mysqld.exe"); // Path to mysqld.exe
const mysqlExePath = path.join(mysqlBasePath, "bin", "mysql.exe"); // Path to mysql.exe
const mysqlDataPath = path.join(mysqlBasePath, "data"); // MySQL data folder
const mysqlServiceName = "MySQL80"; // Change based on MySQL version

// 🛠 Function to extract MySQL ZIP
async function extractMySQL() {
  console.log("📦 Extracting MySQL...");
  try {
    await extract(mysqlZipPath, { dir: extractPath });
    console.log("✅ MySQL extracted successfully!");
  } catch (error) {
    console.error("❌ Error extracting MySQL:", error);
    process.exit(1);
  }
}

// 🛠 Function to initialize MySQL
function initializeMySQL() {
  return new Promise((resolve, reject) => {
    console.log("⚙️ Initializing MySQL...");

    if (!fs.existsSync(mysqlDataPath)) {
      fs.mkdirSync(mysqlDataPath);
    }

    exec(
      `"${mysqlBinPath}" --initialize-insecure --datadir="${mysqlDataPath}" --console`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("❌ MySQL initialization failed:", stderr);
          return reject(error);
        }
        console.log("✅ MySQL initialized successfully!", stdout);
        resolve();
      }
    );
  });
}

// 🛠 Function to install MySQL as a service
function installMySQLService() {
  return new Promise((resolve, reject) => {
    console.log("🔧 Installing MySQL as a Windows service...");

    exec(
      `"${mysqlBinPath}" --install ${mysqlServiceName}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("❌ MySQL service installation failed:", stderr);
          return reject(error);
        }
        console.log(
          `✅ MySQL installed as a service [${mysqlServiceName}]!`,
          stdout
        );
        resolve();
      }
    );
  });
}

// 🛠 Function to start MySQL service
function startMySQLService() {
  return new Promise((resolve, reject) => {
    console.log("🚀 Starting MySQL service...");

    exec(`net start ${mysqlServiceName}`, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Failed to start MySQL service:", stderr);
        return reject(error);
      }
      console.log("✅ MySQL service started successfully!", stdout);
      resolve();
    });
  });
}

// 🛠 Function to check MySQL status
function checkMySQLStatus() {
  return new Promise((resolve, reject) => {
    console.log("🔍 Checking MySQL service status...");

    exec(`sc query ${mysqlServiceName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(
          `❌ MySQL service [${mysqlServiceName}] not found.`,
          stderr
        );
        return reject(error);
      }
      console.log(`✅ MySQL service [${mysqlServiceName}] is running.`);
      resolve();
    });
  });
}

// 🛠 Function to create a root user with password 'root'
function createRootUser() {
  return new Promise((resolve, reject) => {
    console.log("🔑 Setting up MySQL root user...");

    exec(
      `"${mysqlExePath}" -u root --execute="ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'root';"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Failed to set MySQL root password:", stderr);
          return reject(error);
        }
        console.log("✅ Root user password set to 'root'.");
        resolve();
      }
    );
  });
}

// 🛠 Main Function to Run Everything
async function installMySQL() {
  try {
    await extractMySQL();
    await initializeMySQL();
    await installMySQLService();
    await startMySQLService();
    await checkMySQLStatus();
    await createRootUser();
    console.log("🚀 MySQL is installed and running!");
    console.log("🔑 Login using: `mysql -u root -p` (password: root)");
  } catch (error) {
    console.error("❌ Installation failed:", error);
  }
}

// 🔥 Run the Installation
installMySQL();
