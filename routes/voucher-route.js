
const express = require("express");
const {
  addANewVoucher,
  retrieveAllVouchers,
  retrieveVoucher,
  updateAVoucher,
  deleteAVoucher,
  searchVouchers
} = require("../controllers/voucher-controller");
const {
  restrictTo,
} = require("../controllers/generic-controller");
const {validateVoucher}= require("../utils/joi-validators")
const protect = require("../middlewares/protect");

const router = express.Router();

router.post("/",protect,restrictTo("admin"),validateVoucher,addANewVoucher);
router.get("/",retrieveAllVouchers).
get("/search",searchVouchers);
router.route("/:id").
get(retrieveVoucher).
patch(protect,restrictTo("admin"),validateVoucher,updateAVoucher).
delete(protect,restrictTo("admin"),deleteAVoucher);//:id = voucher
module.exports = router;
