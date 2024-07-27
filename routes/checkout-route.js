const express = require('express');
const protect = require("../middlewares/protect");
const {
  processCart,
  processOrder,
}=require("../controllers/checkout-controller")
const {
  verifyPayment,
  getPaymentDetails,
}=require("../utils/payment-paystack")
const router = express.Router();

router.post('/', protect,processCart);
router.get("/:userId",verifyPayment,getPaymentDetails,processOrder);

module.exports = router;