// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const {
  RegisterUser,
  LoginUser,
  getAllCustomers,
  GetUserById,
} = require("../controllers");
const { AuthenticateUser, AuthorizeUser } = require("../middlewares");

// Initialize the router
const router = express.Router();

// Register user
router.post("/register", RegisterUser);

// Login user
router.post("/login", LoginUser);

// Get user by id
router.get(
  "/one/:userId",
  AuthenticateUser,
  AuthorizeUser(["admin"]),
  GetUserById
);
router.get("/all", AuthenticateUser, AuthorizeUser(["admin"]), getAllCustomers);

module.exports = router;
