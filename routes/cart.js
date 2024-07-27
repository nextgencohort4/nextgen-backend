const express = require("express");

const protect = require("../middlewares/protect");
const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cart");
const validate = require("../middlewares/validator");

const router = express.Router();

// Protect rpoutes
router.use(protect);

// cart routes
router.post("/", validate("addToCart"), addToCart);
router.get("/", getCart);
router.patch("/:productId", validate("updateCart"), updateCart);
router.delete("/:productId", removeFromCart);

module.exports = router;
