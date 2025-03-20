const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./utils/database");
const bodyParser = require("body-parser");
const templeteRoutes = require("./routes/templete");
const userRoutes = require("./routes/userManagement");
const compareCsv = require("./routes/compareCsv");
const mergeCsv = require("./routes/merge");
const Templete = require("./models/TempleteModel/templete");
const User = require("./models/User");
const MetaData = require("./models/TempleteModel/metadata");
const Files = require("./models/TempleteModel/files");
const UpdatedData = require("./models/TempleteModel/updatedData");
const Settings = require("./routes/settings")
const upload = require("./routes/upload");
const path = require("path");
const bcrypt = require("bcryptjs");
const Assigndata = require("./models/TempleteModel/assigndata");
const RowIndexData = require("./models/TempleteModel/rowIndexData");
const ImageDataPath = require("./models/TempleteModel/templeteImages");
const MappedData = require("./models/TempleteModel/mappedData");

const { app:electronApp  } = require("electron");
const builtPath =  electronApp.isPackaged? path.join(process.resourcesPath, "dist")  : path.join(__dirname, "dist");
const documentsPath = electronApp.getPath("documents");
const basePath = path.join(documentsPath, "Webdata");
const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise"); 
const createDatabaseIfNotExists = require("./utils/createDb");
//middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

const imageDirectoryPath = path.join(
  __dirname,
  "../",
  "COMPARECSV_FILES",
  "OmrImages",
  "Images_2024-05-04T04-38-30-972Z/005.jpg"
);
// Serve static files from the 'extractedFiles' directory
app.use("/images", express.static(imageDirectoryPath));
app.use("/images", express.static(path.join(basePath, "extractedFiles")));
app.use(express.static(builtPath));


app.use("/users", userRoutes);
app.use(upload);
app.use(compareCsv);
app.use(templeteRoutes);
app.use(mergeCsv);
app.use("/settings", Settings);

// Handle all other routes and serve 'index.html'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// Define associations with cascading deletes
Templete.hasMany(MetaData, {
  foreignKey: {
    name: "templeteId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
});

MetaData.belongsTo(Templete, {
  foreignKey: {
    name: "templeteId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
});

Templete.hasMany(Files, {
  foreignKey: {
    allowNull: false,
  },
  onUpdate: "CASCADE",
});

Files.belongsTo(Templete, {
  foreignKey: {
    allowNull: false,
  },
  onUpdate: "CASCADE",
});

Assigndata.hasMany(RowIndexData, {
  foreignKey: {
    allowNull: false,
  },
  onUpdate: "CASCADE",
});

RowIndexData.belongsTo(Assigndata, {
  foreignKey: {
    allowNull: false,
  },
  onUpdate: "CASCADE",
});

Templete.hasMany(ImageDataPath, {
  foreignKey: {
    name: "templeteId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
});

ImageDataPath.belongsTo(Templete, {
  foreignKey: {
    name: "templeteId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
});

UpdatedData.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
});

User.hasMany(UpdatedData, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
});

Templete.hasMany(MappedData, {
  foreignKey: {
    name: "templeteId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
});

MappedData.belongsTo(Templete, {
  foreignKey: {
    name: "templeteId",
    allowNull: false,
  },
  onUpdate: "CASCADE",
});

// Function to ensure the database exists


// Database Sync and Admin User Creation (Handled in Electron Main)
const startServer = async () => {
  try {
    await createDatabaseIfNotExists()
    await sequelize.sync({ force: false });

    // Check if admin user exists, if not, create it
    const adminUser = await User.findOne({ where: { role: "admin" } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("123456", 12);
      await User.create({
        userName: "admin",
        mobile: "1234567891",
        password: hashedPassword,
        role: "Admin",
        email: "admin@gmail.com",
        permissions: {
          dataEntry: true,
          comparecsv: true,
          csvuploader: true,
          createTemplate: true,
          resultGenerator: true,
        },
      });
    }
    console.log("Database synced and admin user initialized.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Export app and startServer function
module.exports = { app, startServer };
