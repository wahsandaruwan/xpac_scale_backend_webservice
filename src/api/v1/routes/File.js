// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const { SaveFile, DeleteFile } = require("../controllers");
const { AuthenticateUser, AuthorizeUser } = require("../middlewares");
const { FileUpload } = require("../helpers");

// Initialize the router
const router = express.Router();

// Save file to storage
router.post(
  "/save",
  // AuthenticateUser,
  // AuthorizeUser(["admin", "moderator"]),
  FileUpload("file"),
  SaveFile
);

// Save file to storage
router.delete(
  "/delete/:filename",
  // AuthenticateUser,
  // AuthorizeUser(["admin", "moderator"]),
  DeleteFile
);

module.exports = router;
