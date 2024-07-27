const mongoose = require("mongoose");

const TransactionLogSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

const TransactionLog = mongoose.model("TransactionLog", TransactionLogSchema);

module.exports = TransactionLog;
