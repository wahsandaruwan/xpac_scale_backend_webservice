// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const {
  Createitem,
  GetAllitems,
  GetitemsByUserId,
  Updateitem,
  Deleteitem,
} = require("../controllers");

const { AuthenticateUser, AuthorizeUser } = require("../middlewares");

// Initialize the router
const router = express.Router();

// Add machine
router.post(
  "/add-item",
  AuthenticateUser,
  AuthorizeUser(["admin", "customer"]),
  Createitem
);

// Update machine
router.put(
  "/update-item/:itemId",
  AuthenticateUser,
  AuthorizeUser(["admin", "customer"]),
  Updateitem
);

// Delete machine
router.delete(
  "/delete-item/:itemId",
  AuthenticateUser,
  AuthorizeUser(["admin", "customer"]),
  Deleteitem
);

// Get user by id
router.get("/get-all-items", AuthenticateUser, GetAllitems);
router.get("/get-items-user-id", AuthenticateUser, GetitemsByUserId);

module.exports = router;
