const jwt = require("jsonwebtoken");
const { EXPIRES_IN, SECRET, COOKIE_EXPIRATION } = process.env;

// Helper functions
const generateToken = (userId) => {
    return jwt.sign({ userId }, SECRET, { expiresIn: EXPIRES_IN });
  };
  
  const setCookie = (res, token) => {
    try {
      res.cookie("jwt", token, {
        maxAge: new Date(Date.now() + COOKIE_EXPIRATION),
        httpOnly: true,
      });
    } catch (error) {
      console.error("Error setting cookie:", error);
    }
  };
  
  const constructUserResponse = (user, token) => {
    return {
      status: "success",
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      token:token,
      role:user.role
    };
  };
  

  module.exports = {generateToken, constructUserResponse}