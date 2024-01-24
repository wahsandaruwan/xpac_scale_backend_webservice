// ----------Third-party libraries & modules----------
const mongoose = require("mongoose");

// ----------Rule schema----------
const RuleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    emailStatus: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rule", RuleSchema);
