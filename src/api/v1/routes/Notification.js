// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const { SendNotification, SendMessage } = require("../controllers");

// Initialize the router
const router = express.Router();

// Send notification
router.get("/send-notification", SendNotification);

router.get("/send-message", SendMessage);

module.exports = router;
