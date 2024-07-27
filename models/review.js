const mongoose = require("mongoose");
const validator = require("validator");

const ReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
        type: Number,
        validate: {
          validator: function (v) {
            return v >= 0 && v <= 5;
          },
          message: "Rating must be between 0 and 5",
        },
      },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
