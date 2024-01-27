// ----------Third-party libraries and modules----------
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// ----------Define storage instance for files----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// ----------Helper function to define file storage----------
const FileUpload = (field) => {
  const upload = multer({ storage: storage });

  return (req, res, next) => {
    upload.single(field)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: false,
          error: {
            message: "Failed to upload the file!",
          },
        });
      }
      next();
    });
  };
};

const DeleteFileData = async () => {
  try {
    // Drop all collections in the database
    await mongoose.connection.db.dropDatabase();

    return {
      status: true,
      success: {
        message: "Config database successfully.",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      error: {
        message: "Failed to config the database.",
      },
    };
  }
};

module.exports = { FileUpload, DeleteFileData };
