require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const moment = require("moment");
const asyncHandler = require("express-async-handler");

const User = require("../models/user");
const sendEmail = require("../utils/email-service");
const ErrorObject = require("../utils/error");
const {
  generateToken,
  constructUserResponse,
} = require("../utils/helper-functions");


// Create User
const createUser = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, password, role } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    return next(new ErrorObject("A user with this email already exists", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    role,
  });

  const token = generateToken(user._id);

  const userResponse = constructUserResponse(user, token);
  return res.status(201).json({ user: userResponse });
});

// Login User
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorObject("Invalid Credentials", 400));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new ErrorObject("Invalid Credentials", 400));
  }

  const token = generateToken(user._id);

  const userResponse = constructUserResponse(user, token);
  return res.status(200).json({ user: userResponse });
});

// Get All Users
// NOTE: not needed for now.
// const getAllusers = asyncHandler(async (req, res, next) => {
//   const users = await User.find().select("-password");
//   res.status(200).json(users);
// });

// Get Single User
const getUserById = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = req.user;

  if (user.userId != userId) {
    return next(
      new ErrorObject("You are not allowed to access these details", 401)
    );
  }

  const userDetails = await User.findById(userId);
  res.status(200).json({ user: userDetails });
});

// Update User
const updateUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { email, phoneNumber, firstName, lastName } = req.body;

  if (req.user.userId !== userId) {
    return next(
      new ErrorObject("You are not allowed to access these details", 401)
    );
  }

  const updates = {};
  if (email) updates.email = email;
  if (phoneNumber) updates.phoneNumber = phoneNumber;
  if (firstName) updates.firstName = firstName;
  if (lastName) updates.lastName = lastName;

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
  }).select("-password");

  if (!updatedUser) {
    return next(new ErrorObject("User not Found", 404));
  }

  res.status(200).json({ user: updatedUser });
});

// Delete User
const deleteUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (req.user.userId !== userId) {
    return next(
      new ErrorObject("You are not allowed to access these details", 401)
    );
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return next(new ErrorObject("User not Found", 404));
  }

  res.status(204).json({ message: "user deleted successfully" });
});

// Update Password
const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const { userId } = req.params;

  if (!currentPassword || !newPassword) {
    return next(new ErrorObject("Provide both passwords", 400));
  }

  if (currentPassword === newPassword) {
    return res
      .status(400)
      .json({ message: "Make a change of password please" });
  }

  if (req.user.userId !== userId) {
    return next(
      new ErrorObject("You are not allowed to access these details", 401)
    );
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    return next(new ErrorObject("User not Found", 404));
  }

  await isPasswordValid(currentPassword, user.password);

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

// Forgot Password
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  sameUser(req.user.userId, userId, next);

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorObject("User not found", 404));
  }

  const email = user.email;
  const otp = randomstring.generate({ length: 6, charset: "numeric" });
  const expirationTime = moment().add(10, "minutes").toDate();

  user.resetPasswordOTP = otp;
  user.resetPasswordExpires = expirationTime;
  await user.save();

  await sendEmail(
    email,
    "Password Reset OTP",
    `Your OTP for resetting your password is: ${otp}. It will expire in 10 minutes.`,
    next
  );

  res.status(200).json({ message: "OTP sent to your email" });
});

// Reset Password
const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, token, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorObject("User not found", 404));
  }

  if (
    user.resetPasswordOTP !== token ||
    new Date() > user.resetPasswordExpires
  ) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.password = newPassword;
  user.resetPasswordOTP = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
});

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  loginUser,
};
