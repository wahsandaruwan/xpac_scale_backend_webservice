// ----------Custom libraries and modules----------
const mongoose = require("mongoose");
const { RuleModel } = require("../models");

// ----------Conroller function to create a new rule----------
const CreateRule = async (req, res) => {
  // Request body
  const { userId, deviceId, emailStatus } = req.body;

  try {
    // Check if user id and device id combination is available
    const rule = await RuleModel.findOne({
      $and: [{ userId: userId }, { deviceId: deviceId }],
    }).exec();

    if (rule) {
      return res.status(400).json({
        status: false,
        error: {
          message: "User Id and Device Id combination already exists!",
        },
      });
    }

    // New rule
    const newRule = new RuleModel({
      userId,
      deviceId,
      emailStatus,
    });

    // Save new rule to the database
    const savedRule = await newRule.save();

    return res.status(201).json({
      status: true,
      WeighingDevice: savedRule,
      success: {
        message: "Successfully added a new rule!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to add a new rule!",
      },
    });
  }
};

// ----------Conroller function to get all rules----------
const GetAllRules = async (req, res) => {
  try {
    const rules = await RuleModel.find().exec();

    return res.status(200).json({
      status: true,
      rules,
      success: {
        message: "Successfully fetched all rules!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch all rules!",
      },
    });
  }
};

// ----------Conroller function to get all rules by id----------
const GetAllRulesById = async (req, res) => {
  // Request parameters
  const { userId } = req.params;
  try {
    const rules = await RuleModel.find({ userId }).exec();

    return res.status(200).json({
      status: true,
      rules,
      success: {
        message: "Successfully fetched all rules!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch all rules!",
      },
    });
  }
};

// ----------Conroller function to get rule by id----------
const GetRuleById = async (req, res) => {
  // Request parameters
  const { ruleId } = req.params;

  try {
    const rule = await RuleModel.findOne({ _id: ruleId }).exec();
    return res.status(200).json({
      status: true,
      rule,
      success: {
        message: "Successfully fetched the rule!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch the rule!",
      },
    });
  }
};

// ----------Conroller function to update rule by id----------
const UpdateRule = async (req, res) => {
  // Request parameters
  const { ruleId } = req.params;
  try {
    const rule = await RuleModel.findOne({
      _id: ruleId,
    }).exec();
    if (!rule) {
      return res.status(404).json({
        status: true,
        error: { message: "Rule not found!" },
      });
    }
    const updatedRule = await RuleModel.findOneAndUpdate(
      { _id: ruleId },
      {
        $set: req.body,
      },
      {
        new: false,
      }
    );
    return res.status(200).json({
      status: true,
      updatedRule,
      success: {
        message: "Successfully updated the rule!",
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to update the rule!",
      },
    });
  }
};

// Controller function to delete rule by id
const DeleteRuleById = async (req, res) => {
  // Request parameters
  const { ruleId } = req.params;

  try {
    // Find the rule by id
    const rule = await RuleModel.findOne({ _id: ruleId }).exec();

    // If the rule does not exist, return a 404 response
    if (!rule) {
      return res.status(404).json({
        status: false,
        error: {
          message: "Rule not found!",
        },
      });
    }

    // Remove the rule
    await RuleModel.findOneAndRemove({ _id: ruleId });

    return res.status(200).json({
      status: true,
      success: {
        message: "Successfully deleted the rule!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to delete the rule!",
      },
    });
  }
};

module.exports = {
  CreateRule,
  GetAllRules,
  GetAllRulesById,
  GetRuleById,
  UpdateRule,
  DeleteRuleById,
};
