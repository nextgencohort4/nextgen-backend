/*
id, name, description, price, discount_price, colors, sizes, images, delivery_info, return_info
*/
const mongoose = require("mongoose");
const validator = require("validator");


const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Provide a product name"] },
    description: {
      type: String,
      required: [true, "provide a product description"],
    },
    price: { type: Number, required: [true, "provide a product price"] },
    discount_price: {type: Number },
    colors:{
      type: [String],
      required: true,
      validate: {
        validator: function(arr) {
          return arr.length > 0;
        },
        message: 'There must at least be one color.'
      }
    },
    sizes:{
      type: [Number],
      required: true,
      validate: {
        validator: function(arr) {
          return arr.length > 0;
        },
        message: 'There must at least be one size.'
      }
    },
    images:{
      type: [String],
      required: true,
      validate: {
        validator: function(arr) {
          return arr.length > 0;
        },
        message: 'There must at least be one image.'
      }
    },

    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    }],
    delivery_info: { 
      type: String,
      required: true,
     },
    return_info: { 
      type: String,
      required: true,
     },
  },
  {
    toObject: {virtuals: true,},
    toJSON: {virtuals: true,},
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
