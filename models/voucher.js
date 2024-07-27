const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountAmount: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    maxUses: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Voucher = mongoose.model("Voucher", VoucherSchema);

module.exports = Voucher;
