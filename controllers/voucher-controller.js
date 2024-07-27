const QueryMethod = require("../utils/query");
const catchAsync = require("../utils/catch-async");
const Econsole = require("../utils/econsole-log");
const Voucher = require("../models/voucher")
const { getOne, createOne, updateOne, deleteOne, getAll } = require("./generic-controller");


exports.retrieveVoucher = getOne(Voucher)
exports.addANewVoucher=createOne(Voucher)
exports.retrieveAllVouchers=getAll(Voucher)
exports.updateAVoucher = updateOne(Voucher)
exports.deleteAVoucher = deleteOne(Voucher)
exports.searchVouchers = catchAsync(async (req, res) => {
  const myconsole = new Econsole("voucher-controller.js", "searchVouchers", "")
  myconsole.log("entry")
  const q = req.query.q
  const vouchers = await Voucher.find({code:{ $regex: q, $options: 'i' }})// Case-insensitive search in 'code'
  myconsole.log("vouchers=",vouchers)
  myconsole.log("exits")
  res.status(200).json({ status: "success", results: vouchers.length, data: vouchers, });
});