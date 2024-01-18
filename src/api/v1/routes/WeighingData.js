// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const {
  CreateWeighingData,
  UpdateWeighingData,
  DeleteWeighingData,
} = require("../controllers");

const { AuthenticateUser, AuthorizeUser } = require("../middlewares");

// Initialize the router
const router = express.Router();

// Add weighing data
router.get(
  "/add-data",
  CreateWeighingData
);

// Update weighing data
router.put(
  "/update-data/:weighingDataId",
  AuthenticateUser,
  AuthorizeUser(["admin", "customer"]),
  UpdateWeighingData
);

// Delete weighing data
router.delete(
  "/delete-device/:weighingDataId",
  AuthenticateUser,
  AuthorizeUser(["admin", "customer"]),
  DeleteWeighingData
);

module.exports = router;
