// ----------Third-party libraries & modules----------
const ExcelJS = require("exceljs");

const GenerateExcelFile = async (columns, data, fileName, type) => {
  // Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  // Add columns
  worksheet.columns = columns;

  // Add data to the excel sheel
  if (type == "device") {
    // Create a new row for each data item
    worksheet.addRow({
      id: data.id,
      title: data.title,
      itemCount: data.itemCount,
      totalWeight: data.totalWeight,
      batteryPercentage: data.batteryPercentage,
      batteryVoltage: data.batteryVoltage,
    });
  } else if (type == "devices") {
    console.log(data);
    data.forEach((item, index) => {
      // Create a new row for each data item
      worksheet.addRow({
        id: item._id,
        title: item.title,
        itemCount: item.deviceData.itemCount ? item.deviceData.itemCount : 0,
        totalWeight: item.deviceData.totalWeight
          ? item.deviceData.totalWeight
          : 0,
        batteryPercentage: item.deviceData.batteryPercentage
          ? item.deviceData.batteryPercentage
          : 0,
        batteryVoltage: item.deviceData.batteryVoltage
          ? item.deviceData.batteryVoltage
          : 0,
      });
    });
  }

  // Create a file path
  const filePath = `./downloads/${fileName}`;

  // Save the Excel file
  const status = await workbook.xlsx.writeFile(filePath);

  return status;
};

module.exports = { GenerateExcelFile };
