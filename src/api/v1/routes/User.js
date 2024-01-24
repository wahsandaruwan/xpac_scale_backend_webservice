// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const {
  RegisterUser,
  LoginUser,
  getAllCustomers,
  GetUserById,
  UpdateUser,
  DeleteUserById,
} = require("../controllers");
const { AuthenticateUser, AuthorizeUser } = require("../middlewares");

// Initialize the router
const router = express.Router();

// Register user
router.post(
  "/register",
  AuthenticateUser,
  AuthorizeUser(["admin"]),
  RegisterUser
);

// Login user
router.post("/login", LoginUser);

// Get user by id
router.get(
  "/one/:userId",
  AuthenticateUser,
  AuthorizeUser(["admin", "moderator"]),
  GetUserById
);
router.get(
  "/all",
  AuthenticateUser,
  AuthorizeUser(["admin", "moderator"]),
  getAllCustomers
);

router.put(
  "/update/:userId",
  AuthenticateUser,
  AuthorizeUser(["admin"]),
  UpdateUser
);

router.delete(
  "/delete/:userId",
  AuthenticateUser,
  AuthorizeUser(["admin"]),
  DeleteUserById
);

module.exports = router;
