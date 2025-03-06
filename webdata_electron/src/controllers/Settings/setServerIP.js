const fs = require("fs");
const path = require("path");
const { app } = require("electron"); 

exports.changeServerIP = (req, res) => {
  try {
    const { ip } = req.body;
    //   const configPath = path.join(__dirname, "../dist/config.json");
    // const configPath = path.join(
    //   __dirname,
    //   "../../dist/config.json"
    // );
  const pathsec=  path.join(__dirname, "./dist");
    const configPath = path.join(app.getPath("userData"), "config.json");
    console.log(configPath)
    // Read the existing config.json
    const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));

    // Update the SERVER_IP field
    configData.SERVER_IP = `http://${ip}:4000`;
    configData.APP_IP = ip;
    // Write the updated config back to the file
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), "utf8");

    console.log(`✅ SERVER_IP updated to: ${ip}`);
    return res
      .status(200)
      .json({ success: true, message: "SERVER_IP updated successfully" });
  } catch (error) {
    const pathsec=  path.join(__dirname,"../", "./dist");
    const configPath = path.join(app.getPath("userData"), "config.json");
    console.error("❌ Error updating SERVER_IP:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update SERVER_IP",configPath,pathsec });
  }
};
