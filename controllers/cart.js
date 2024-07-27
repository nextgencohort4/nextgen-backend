const asyncHandler = require("express-async-handler");

const Cart = require("../models/cart");
const Product = require("../models/product");
const ErrorObject = require("../utils/error");

const addToCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const { productId, quantity, color, size } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorObject("Product not found", 404));
  }

  let cart = await Cart.findOne({ userId });

  if (cart) {
    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(productId)
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, color, size });
    }
  } else {
    cart = await Cart.create({
      userId,
      items: [{ productId, quantity, color, size }],
    });
  }

  await cart.save();
  res.status(201).json({ cart });
});

const getCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const cart = await Cart.findOne({userId}).populate(
    "items.productId",
    "name price"
  );
  if (!cart) {
    return next(new ErrorObject("Cart not found", 404));
  }
  res.status(200).json({ cart });
});

const updateCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const { productId } = req.params;
  const { quantity, color, size } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new ErrorObject("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex((item) =>
    item.productId.equals(productId)
  );
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].color = color;
    cart.items[itemIndex].size = size;
    await cart.save(); 
  } else {
    return next(new ErrorObject("Product not found in cart", 404));
  }

  res.status(200).json({ cart });
});

const removeFromCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new ErrorObject("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex((item) =>
    item.productId.equals(productId)
  );
  if (itemIndex > -1) {
    cart.items.splice(itemIndex, 1);
    await cart.save();
  } else {
    return next(new ErrorObject("Product not found in cart", 404));
  }
  res.status(200).json({ cart });
});

module.exports = { addToCart, getCart, updateCart, removeFromCart };
