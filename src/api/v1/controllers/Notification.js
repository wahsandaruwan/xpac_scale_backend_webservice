// ----------Custom libraries and modules----------
const mongoose = require("mongoose");

const { WeighingDeviceModel, UserModel, RuleModel } = require("../models");
const { SendEmail } = require("../helpers");

// ----------Conroller function to send notification for benchmark count----------
const SendNotification = async (req, res) => {
  // Request body
  const { battery_percentage, battery_voltage, total_weight, item_count, id } =
    req.query;

  // Ensure values are not less than 0
  const sanitizedBatteryPercentage = Math.max(
    0,
    parseFloat(battery_percentage) || 0
  );
  const sanitizedBatteryVoltage = Math.max(0, parseFloat(battery_voltage) || 0);
  const sanitizedTotalWeight = Math.max(0, parseFloat(total_weight) || 0);
  const sanitizedItemCount = Math.max(0, parseInt(item_count) || 0);

  try {
    // Check if the WeighingDevice with the specified ID exists
    const weghingDevice = await WeighingDeviceModel.findOne({
      _id: id,
    }).exec();

    if (!weghingDevice) {
      return res.status(404).json({
        status: false,
        error: {
          message: "WeighingDevice not found with the specified ID.",
        },
      });
    }

    const userData = await RuleModel.aggregate([
      {
        $match: {
          deviceId: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users", // Assuming the collection name is 'users'
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Unwind the userIds array
      },
      {
        $match: {
          "userDetails.emailStatus": "yes", // Filter by user status
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          "userDetails.fullName": 1,
          "userDetails.emailAddress": 1,
          "userDetails.phoneNumber": 1,
        },
      },
    ]);

    const adminUsers = await UserModel.find({ userType: "admin" });

    const recipients = [
      ...userData.map((item) => {
        const userDetails = item.userDetails[0];
        return {
          name: userDetails.fullName || "",
          email: userDetails.emailAddress || "",
        };
      }),
      ...adminUsers.map((adminUser) => ({
        name: adminUser.fullName || "",
        email: adminUser.emailAddress || "",
      })),
    ];

    const data = `<b>This is an automated-email, please do not reply!</b> <br/><div style="background-color: #ff0000; color: #ffffff; text-align: center; padding: 10px;"><h1 style="margin: 0;">XORDER</h1></div> <br/> <h1><b>Dear User,</b></h1><b>Carton has reached critical level.</b> <br/> <br/> Device Id : ${id} <br/> Device Title : ${weghingDevice.title} <br/> Assigned Product : ${weghingDevice.assignedProduct} <br/> <br/> Device Item Count : ${sanitizedItemCount} <br/> Device Battery Percentage : ${sanitizedBatteryPercentage} <br/> Device Total Weight : ${sanitizedTotalWeight} </br> Device Battery Voltage : ${sanitizedBatteryVoltage} <br/><br/> The alert status is <b>CRITICAL</b> state, please do immediate response. <br/> <br/> <div style="background-color: #ff0000; color: #000000; text-align: center; padding: 15px;"> <p style="margin: 0;">Xpac Technologies PTE LTD.</p></div>`;

    const result = await SendEmail({
      recipients,
      subject: `Critical notification for the device "${weghingDevice.title}"`,
      htmlContent: data,
    });

    if (result.status != "success") {
      return res.status(500).json({
        status: false,
        error: {
          message: "Internal Server Error. Please try again later",
        },
      });
    }
    return res.status(200).send({
      status: true,
      success: {
        message: "Successfully sent emails!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to send emails!",
      },
    });
  }
};

// ----------Conroller function to send email messages for refilling----------
const SendMessage = async (req, res) => {
  // Request body
  const { id } = req.query;

  try {
    // Check if the WeighingDevice with the specified ID exists
    const weghingDevice = await WeighingDeviceModel.findOne({
      _id: id,
    }).exec();

    if (!weghingDevice) {
      return res.status(404).json({
        status: false,
        error: {
          message: "WeighingDevice not found with the specified ID.",
        },
      });
    }

    const userData = await RuleModel.aggregate([
      {
        $match: {
          deviceId: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users", // Assuming the collection name is 'users'
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Unwind the userIds array
      },
      {
        $match: {
          "userDetails.emailStatus": "yes", // Filter by user status
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          "userDetails.fullName": 1,
          "userDetails.emailAddress": 1,
          "userDetails.phoneNumber": 1,
        },
      },
    ]);

    const adminUsers = await UserModel.find({ userType: "admin" });

    const recipients = [
      ...userData.map((item) => {
        const userDetails = item.userDetails[0];
        return {
          name: userDetails.fullName || "",
          email: userDetails.emailAddress || "",
        };
      }),
      ...adminUsers.map((adminUser) => ({
        name: adminUser.fullName || "",
        email: adminUser.emailAddress || "",
      })),
    ];

    const data = `<b>This is an automated-email, please do not reply!</b> <br/><div style="background-color: #29b33b; color: #ffffff; text-align: center; padding: 10px;"><h1 style="margin: 0;">XORDER</h1></div> <br/> <h1><b>Dear User,</b></h1> We are <br>REFILLING</b> products "${weghingDevice.assignedProduct}" to the device "${weghingDevice.title}" with the ID of "${id}".<br/> <br/> <div style="background-color: #29b33b; color: #000000; text-align: center; padding: 15px;"> <p style="margin: 0;">Xpac Technologies PTE LTD.</p></div>`;

    const result = await SendEmail({
      recipients,
      subject: `Refilling notification for the device "${weghingDevice.title}`,
      htmlContent: data,
    });

    if (result.status != "success") {
      return res.status(500).json({
        status: false,
        error: {
          message: "Internal Server Error. Please try again later",
        },
      });
    }
    return res.status(200).send({
      status: true,
      success: {
        message: "Successfully sent emails!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to send emails!",
      },
    });
  }
};

module.exports = {
  SendNotification,
  SendMessage,
};
