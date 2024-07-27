const express = require("express");

const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  loginUser,
} = require("../controllers/user");

const validate = require("../middlewares/validator");
const protect = require("../middlewares/protect");

const router = express.Router();

// Signup route
router.post("/", validate("register"), createUser);

// Login route
router.post("/login", validate("login"), loginUser);

// Password reset route
router.post("/password-reset", resetPassword);

// Forgot password route
router.post("/password/:id", forgotPassword);

// Protected routes (require authentication)
router.use(protect);

// User management routes
router.get("/:userId", getUserById);
router.patch("/:userId", validate("update"), updateUser);``
router.delete("/:userId", deleteUser);

// Password update route
router.patch("/password/:id", updatePassword);


module.exports = router;
