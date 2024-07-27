/*
id, user_id, delivery_address, delivery_type, payment_method, voucher_code, total_amount
*/
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deliveryAddress: { type: String, required: true },
    deliveryType: { type: String, required: true },
    paymentMethod: { type: String, required: false },
    voucherCode: { type: String,required:false},
    totalAmount: { type: Number, required: true },
    currency:{type:String,required:false},
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
