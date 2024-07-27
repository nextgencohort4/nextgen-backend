const mongoose = require("mongoose");

const FavouriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  productIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }]
}, { timestamps: true });

const Favourite = mongoose.model("Favorite", FavouriteSchema);

module.exports = Favourite;
