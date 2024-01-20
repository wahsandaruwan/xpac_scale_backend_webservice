// ----------Third-party libraries and modules----------
const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv/config");

// ----------Custom libraries and modules----------
const Configs = require("./configs");
const { ConnectDatabase } = require("./api/v1/helpers");
const {
  UserRoutes,
  WeighingDeviceRoutes,
  WeighingDataRoutes,
  UserTokenRoutes,
  ItemRoutes,
  FileRoutes,
  SummaryRoutes,
  NotificationRoutes,
} = require("./api/v1/routes");
const { GenerateExcelFile } = require("./api/v1/helpers");

// ----------Global instances----------
const app = express();
const PORT = Configs.DEV_PORT || 3308;
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// ----------Common middleware----------
app.use(cors());
// Accept json
app.use(express.json());
app.use(express.static("static"));

// Allow access uploads folder
app.use("/uploads", express.static("./uploads/"));

// Allow access downloads folder
app.use("/downloads", express.static("./downloads/"));

// Base route
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: { message: `Welcome to the production server!` } });
});

// User route
app.use("/api/users", UserRoutes);

// Device data route
app.use("/api/weighingdata", WeighingDataRoutes);

// Device route
app.use("/api/device", WeighingDeviceRoutes);

// Item route
app.use("/api/item", ItemRoutes);

// User token route
app.use("/api/usertokens", UserTokenRoutes);

// File route
app.use("/api/files", FileRoutes);

//Summary route
app.use("/api/summary", SummaryRoutes);

//Notification route
app.use("/api/notification", NotificationRoutes);

//Excel route
app.post("/api/excel/:type", async (req, res) => {
  const { type } = req.params;
  console.log(req.body);
  // Columns for excel
  const columns = [
    { header: "Id", key: "id", width: 50 },
    { header: "Title", key: "title", width: 30 },
    { header: "Item Count", key: "itemCount", width: 30 },
    { header: "Total Weight (g)", key: "totalWeight", width: 30 },
    { header: "Battery Percentage (%)", key: "batteryPercentage", width: 30 },
    { header: "Battery Voltage (V)", key: "batteryVoltage", width: 30 },
  ];

  let fileName = "";

  if (type == "device") {
    fileName = "device_data.xlsx";
  } else if (type == "devices") {
    fileName = "all_devices_data.xlsx";
  }

  // Generate excel file
  await GenerateExcelFile(columns, req.body, fileName, type);

  return res.status(200).json({
    status: true,
    success: {
      message: "Successfully fetched all data and created a excel file!",
    },
  });
});

app.get((req, res) => {
  res.sendFile(path.join(__dirname, "static/index.html"));
});

// Error route
app.use((req, res) => {
  res.status(404).json({ error: { message: `Not found!` } });
});

// ----------Initialize the connection----------
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);

  // Initialize the db connection
  ConnectDatabase()
    .then(() => console.log("Connected to DB!"))
    .catch((err) => console.log(err));
});
