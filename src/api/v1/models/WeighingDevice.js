// ----------Third-party libraries & modules----------
const mongoose = require("mongoose");

// ----------User schema----------
const WeighingDeviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    assignedItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: 0,
    },
    dateCreated: {
      type: String,
    },
    timeCreated: {
      type: String,
    },
    dateUpdated: {
      type: String,
    },
    timeUpdated: {
      type: String,
    },
  },
  { timestamps: true }
);

// Define a pre 'remove' hook
WeighingDeviceSchema.pre("remove", async function (next) {
  try {
    // Delete associated WeighingData documents
    await mongoose
      .model("WeighingData")
      .deleteMany({ weighingDeviceId: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("WeighingDevice", WeighingDeviceSchema);
