const asyncHandler = require("express-async-handler");
const Favourite = require("../models/favourite");
const ErrorObject = require("../utils/error");

// Add a product to the favorites
const addFavourite = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user.userId;

  let favourite = await Favourite.findOne({ userId });

  if (favourite) {
    if (favourite.productIds.includes(productId)) {
      return next(new ErrorObject("Product already in favourites", 400));
    }
    favourite.productIds.push(productId);
    await favourite.save();
  } else {
    favourite = await Favourite.create({
      userId,
      productIds: [productId],
    });
  }

  res.status(201).json({ favourite });
});

// Retrieve the current user's favorites
const getFavourites = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const favourite = await Favourite.findOne({ userId }).populate("productIds");

  if (!favourite) {
    return res.status(200).json({ favourite: [] });
  }

  res.status(200).json({ favourite });
});

// Remove a product from the favorites
const removeFavourite = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user.userId;

  const favourite = await Favourite.findOne({ userId });

  if (!favourite) {
    return next(new ErrorObject("No favourites found for this user", 404));
  }

  const productIndex = favourite.productIds.indexOf(productId);
  if (productIndex === -1) {
    return next(new ErrorObject("Product not found in favourites", 404));
  }

  favourite.productIds.splice(productIndex, 1);
  await favourite.save();

  res.status(204).json({ message: "Product removed from favourites" });
});

module.exports = {
  addFavourite,
  getFavourites,
  removeFavourite,
};
