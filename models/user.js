const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
      maxlength: [50, "first name must not be more than fifty characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
      maxlength: [50, "last name must not be more than fifty characters"],
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "a user with this email already exists"],
      required: [true, "Please provide an email address"],
      trim: true,
      lowerCase: true,
    },

    phoneNumber: { type: String, required: true, trim: true },
    password: {
      type: String,
      required: [true, "user must have a password"],
      select: false,
      minLength: [8, "Password must ba at least 8 characters"],
    },

    resetPasswordOTP: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },

    role:{
      type: String,
      default: "buyer",
    }
  },
  {
    toObject: {virtuals: true,},
    toJSON: {virtuals: true,},
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
