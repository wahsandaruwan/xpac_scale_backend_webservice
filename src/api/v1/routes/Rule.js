// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const {
  CreateRule,
  GetAllRules,
  GetAllRulesById,
  GetRuleById,
  UpdateRule,
  DeleteRuleById,
} = require("../controllers");
const { AuthenticateUser, AuthorizeUser } = require("../middlewares");

// Initialize the router
const router = express.Router();

// Create rule
router.post("/create", AuthenticateUser, AuthorizeUser(["admin"]), CreateRule);

// Get rule by id
router.get(
  "/one/:ruleId",
  AuthenticateUser,
  AuthorizeUser(["admin", "moderator"]),
  GetRuleById
);

// Get all rules
router.get(
  "/all",
  AuthenticateUser,
  AuthorizeUser(["admin", "moderator"]),
  GetAllRules
);

// Get all rules by id
router.get(
  "/all/:userId",
  AuthenticateUser,
  AuthorizeUser(["admin", "moderator", "customer"]),
  GetAllRulesById
);

router.put(
  "/update/:ruleId",
  AuthenticateUser,
  AuthorizeUser(["admin"]),
  UpdateRule
);

router.delete(
  "/delete/:ruleId",
  AuthenticateUser,
  AuthorizeUser(["admin"]),
  DeleteRuleById
);

module.exports = router;
