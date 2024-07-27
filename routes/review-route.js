
const express = require("express");
const {
  editAReview,
  deleteAReview,
  moveUserIdAndProductIdToRequestBody,
} = require("../controllers/review-controller");

const {validateReview}= require("../utils/joi-validators")
const protect = require("../middlewares/protect");

const router = express.Router();

router.route("/:id").
patch(protect,moveUserIdAndProductIdToRequestBody,validateReview,editAReview).
delete(protect,deleteAReview);//:id = review
module.exports = router;
