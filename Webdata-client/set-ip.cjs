const fs = require("fs");
const os = require("os");
const path = require("path");

// Function to get local IPv4 address
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      if (!iface.internal && iface.family === "IPv4") {
        return iface.address; // Return first found IPv4 address
      }
    }
  }
  return "127.0.0.1"; // Fallback if no external IP is found
};

const localIP = getLocalIp();
const configFilePath = path.join(__dirname, "public", "config.json");

// Function to update only `SERVER_IP` and `APP_IP`
const updateConfigFile = () => {
  try {
    // Read the existing config.json
    const configData = JSON.parse(fs.readFileSync(configFilePath, "utf8"));

    // Update only the required keys
    configData.SERVER_IP = `http://${localIP}:4000`;
    configData.APP_IP = localIP;

    // Write the updated config back to the file
    fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2), "utf8");

    console.log(`✅ Updated SERVER_IP to ${configData.SERVER_IP}`);
    console.log(`✅ Updated APP_IP to ${configData.APP_IP}`);
  } catch (error) {
    console.error("❌ Error updating config.json:", error);
    process.exit(1);
  }
};

// Run the update function
updateConfigFile();
