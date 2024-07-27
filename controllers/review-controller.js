const catchAsync = require("../utils/catch-async");
const Econsole = require("../utils/econsole-log");
const Product = require("../models/product")
const Review = require("../models/review")
const User = require("../models/user")
const { updateOne, deleteOne } = require("./generic-controller");

exports.moveUserIdAndProductIdToRequestBody = catchAsync(async (req, res,next) => {
  const myconsole = new Econsole("review-controller.js", "moveUserIdAndProductIdToRequestBody", "")
  const productId = req.query.productId;
  const userId = req.user.userId
  req.body.userId = userId
  req.body.productId = productId;
  myconsole.log("exits")
  next()
});
exports.editAReview = updateOne(Review)
exports.deleteAReview = deleteOne(Review)

exports.reviewProduct = catchAsync(async (req, res) => {
  const myconsole = new Econsole("review-controller.js", "reviewProduct", "")
  try {
    const productId = req.params.id;
    const userId = req.user.userId
    req.body.userId = userId
    req.body.productId = productId;
    const review = new Review(req.body);

    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

     // Save the review separately
    const savedReview = await review.save();

    // Associate the review with the product
    product.reviews.push(savedReview._id);
    await product.save();
    //product = await Product.findById(productId).populate('reviews');
    const user = await User.findById(userId);
    const reviewData = {data:{user:user,review:savedReview}}
    myconsole.log("exits")
    //res.status(201).json(product);
    res.status(201).json(reviewData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});