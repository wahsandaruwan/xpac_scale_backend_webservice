// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const { SendNotification, SendMessage } = require("../controllers");

// Initialize the router
const router = express.Router();

// Send notification for benchmark count
router.get("/send-notification", SendNotification);

// Send email messages for refilling
router.get("/send-message", SendMessage);

module.exports = router;
