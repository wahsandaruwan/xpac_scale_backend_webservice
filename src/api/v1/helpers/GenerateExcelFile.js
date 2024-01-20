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
    data.forEach((item, index) => {
      // Create a new row for each data item
      worksheet.addRow({
        id: item.id,
        title: item.title,
        itemCount: item.itemCount,
        totalWeight: item.totalWeight,
        batteryPercentage: item.batteryPercentage,
        batteryVoltage: item.batteryVoltage,
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
