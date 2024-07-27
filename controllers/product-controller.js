const QueryMethod = require("../utils/query");
const catchAsync = require("../utils/catch-async");
const Econsole = require("../utils/econsole-log");
const Product = require("../models/product")
const { createOne, getOne, updateOne, deleteOne } = require("./generic-controller");
const { cloudDelete } = require("../utils/cloudinary")


exports.retrieveProduct = getOne(Product)
exports.addANewProduct=createOne(Product)
exports.retrieveAllProducts = catchAsync(async (req, res) => {
  const myconsole = new Econsole("product-controller.js", "retrieveAllProducts", "")
  myconsole.log("entry")
  const productQuery = new QueryMethod(Product.find().populate("reviews"), req.query)
    .sort()
    .limit()
    .paginate()
    .filter();
  const products = await productQuery.query;
  myconsole.log("exits")
  res.status(200).json({ status: "success", results: products.length, data: products, });
});
exports.searchProducts = catchAsync(async (req, res) => {
  const myconsole = new Econsole("product-controller.js", "searchProducts", "")
  myconsole.log("entry")
  const q = req.query.q
  const products = await Product.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },        // Case-insensitive search in 'name'
      { category: { $regex: q, $options: 'i' } },    // Case-insensitive search in 'category'
      { description: { $regex: q, $options: 'i' } }, // Case-insensitive search in 'description'
      { $expr: { $regexMatch: { input: { $toString: "$price" }, regex: q, options: 'i' } } }, // Convert and search 'price'
      { $expr: { $regexMatch: { input: { $toString: "$discount_price" }, regex: q, options: 'i' } } }, // Convert and search 'discount_price'
    ],
  })
  myconsole.log("products=",products)
  myconsole.log("exits")
  res.status(200).json({ status: "success", results: products.length, data: products, });
});
exports.updateProduct = updateOne(Product)
exports.removeProduct = deleteOne(Product)
exports.removeProductImages = catchAsync(async (req, res, next) => {
  const myconsole = new Econsole("product-controller.js", "removeProductImages", "")
  myconsole.log("entry")
  const product = await Product.findById(req.params.id);
  try {
    if (product.images) {
      product.images.forEach(async (imageFileURL, index) => {
        try {
          myconsole.log("imageFileURL", imageFileURL)
          await cloudDelete(imageFileURL);
        } catch (error) {
          myconsole.error(error);
        }
      });
    }
  } catch (error) {
    myconsole.error(error)
  }
  myconsole.log("exits")
  next()
});
