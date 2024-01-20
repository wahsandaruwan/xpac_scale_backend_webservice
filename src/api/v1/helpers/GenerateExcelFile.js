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
    data.forEach((item, index) => {
      // Create a new row for each data item
      worksheet.addRow({
        id: item._id,
        title: item.title,
        itemCount: item.deviceData.itemCount,
        totalWeight: item.deviceData.totalWeight,
        batteryPercentage: item.deviceData.batteryPercentage,
        batteryVoltage: item.deviceData.batteryVoltage,
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
