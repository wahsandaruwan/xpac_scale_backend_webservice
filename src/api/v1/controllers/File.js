const { DeleteFileData } = require("../helpers");
const fs = require("fs");
const path = require("path");

// ----------Controller function to save file to storage----------
const SaveFile = async (req, res) => {
  // Access file
  const file = req.file;

  // Check if file exists in the request
  if (!file) {
    return res.status(404).json({
      status: false,
      error: {
        message: "There is no any uploaded file!",
      },
    });
  }

  res.status(200).json({
    status: true,
    success: {
      message: "Successfully uploaded the file!",
    },
    fileName: file.filename,
  });
};

const DeleteFile = async (req, res) => {
  const filePath = path.join(
    __dirname,
    "../../../../uploads",
    req.params.filename
  );
  console.log(filePath);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Failed to delete the file!",
        },
      });
    }

    res.status(200).json({
      status: true,
      success: {
        message: "Successfully deleted the file!",
      },
      fileName: req.params.filename,
    });
  });
};

module.exports = {
  SaveFile,
  DeleteFile,
};
