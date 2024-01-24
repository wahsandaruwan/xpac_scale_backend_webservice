// ----------Third-party libraries and modules----------
const bcrypt = require("bcrypt");

// ----------Custom libraries and modules----------
const { UserModel, UserTokenModel, RuleModel } = require("../models");
const { GenerateTokens, SendEmail } = require("../helpers");

// ----------Conroller function to register new user----------
const RegisterUser = async (req, res) => {
  // Request body
  const { fullName, emailAddress, password, phoneNumber, userType } = req.body;

  try {
    // Check if email or phone number already exist
    const user = await UserModel.findOne({
      $or: [{ emailAddress }, { phoneNumber }],
    }).exec();
    if (user) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Email or phone number already exist!",
        },
      });
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 8);

    // New user
    const newUser = new UserModel({
      fullName,
      emailAddress,
      password: hashedPassword,
      phoneNumber,
      userType,
    });

    // Save new user to the database
    const savedUser = await newUser.save();

    const recipients = [
      {
        name: fullName || "",
        email: emailAddress || "",
      },
    ];

    const data = `Your Email Address is ${userType} </br> Your Email Address is ${emailAddress} <br/> Your Password is ${password} <br/>`;

    const result = await SendEmail({
      recipients,
      subject: `Details about the Account`,
      htmlContent: data,
    });

    console.log(result);

    return res.status(201).json({
      status: true,
      user: savedUser,
      success: {
        message: "Successfully registered a new user!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to register a new user!",
      },
    });
  }
};

// ----------Conroller function to login the user----------
const LoginUser = async (req, res) => {
  // Request body
  const { emailAddress, password } = req.body;

  try {
    // Check if email already exists
    const user = await UserModel.findOne({ emailAddress }).exec();
    if (!user) {
      return res.json({
        status: false,
        error: { message: "User not found for the giving credentials!" },
      });
    }

    // Check if password matches
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res.json({
        status: false,
        error: { message: "Invalid credentials!" },
      });
    }

    // Check if user id already exists
    const userToken = await UserTokenModel.findOne({ userId: user._id }).exec();
    if (userToken) {
      // Delete the token record
      await userToken.deleteOne({ userId: user._id });
    }

    // Generate tokens
    const { accessToken, refreshToken } = GenerateTokens(user);

    // New token
    const newToken = new UserTokenModel({
      userId: user._id,
      token: refreshToken,
    });

    // Save new refresh token record to the database
    await newToken.save();

    return res.status(201).json({
      status: true,
      accessToken,
      refreshToken,
      userId: user._id,
      userType: user.userType,
      success: {
        message: "Successfully logged in the user!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to logged in the user!",
      },
    });
  }
};

// ----------Conroller function to get all user ----------
const getAllCustomers = async (req, res) => {
  try {
    const customers = await UserModel.find().exec();

    return res.status(200).json({
      status: true,
      customers,
      success: {
        message: "Successfully fetched the customers!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch the user!",
      },
    });
  }
};

// ----------Conroller function to get user by id----------
const GetUserById = async (req, res) => {
  // Request parameters
  const { userId } = req.params;

  try {
    const user = await UserModel.findOne({ _id: userId }).exec();
    return res.status(200).json({
      status: true,
      user,
      success: {
        message: "Successfully fetched the user!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch the user!",
      },
    });
  }
};

// ----------Conroller function to update user by id----------
const UpdateUser = async (req, res) => {
  // Request parameters
  const { userId } = req.params;
  try {
    const user = await UserModel.findOne({
      _id: userId,
    }).exec();
    if (!user) {
      return res.status(404).json({
        status: true,
        error: { message: "User not found!" },
      });
    }
    const updateuser = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: req.body,
      },
      {
        new: false,
      }
    );
    return res.status(200).json({
      status: true,
      updateuser,
      success: {
        message: "Successfully updated the user!",
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to update the user!",
      },
    });
  }
};

// Controller function to delete user by id
const DeleteUserById = async (req, res) => {
  // Request parameters
  const { userId } = req.params;

  try {
    // Find the user by id
    const user = await UserModel.findOne({ _id: userId }).exec();

    // If the user does not exist, return a 404 response
    if (!user) {
      return res.status(404).json({
        status: false,
        error: {
          message: "User not found!",
        },
      });
    }

    // Remove the user
    await UserModel.findOneAndRemove({ _id: userId });

    // Delete rules
    await RuleModel.deleteMany({ deviceId: deviceId });

    return res.status(200).json({
      status: true,
      success: {
        message: "Successfully deleted the user!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to delete the user!",
      },
    });
  }
};

module.exports = {
  RegisterUser,
  LoginUser,
  getAllCustomers,
  GetUserById,
  UpdateUser,
  DeleteUserById,
};
