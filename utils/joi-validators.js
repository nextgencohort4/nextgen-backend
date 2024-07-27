const Joi = require('joi')
const crypto = require('crypto');
const catchAsync=require("../utils/catch-async")
const Econsole = require("../utils/econsole-log")

exports.validateProduct = catchAsync(async (req, res, next) => {
    /*
    id, name, description, price, discount_price, colors, sizes, images, delivery_info, return_info
    */
    const myconsole = new Econsole("joi-validators.js", "validateProduct", "")
    myconsole.log("entry")
    const { name, description, price, discount_price, colors, sizes, images, delivery_info, return_info } = req.body;
    console.log(name, description, price, discount_price, colors, sizes, images, delivery_info, return_info)
    const obj = { name, description, price, discount_price, colors, sizes, images, delivery_info, return_info }
    var expectedProductProperties = Joi.object({
        name: Joi.string().required().messages({
            "string.base": "name should be a type of text",
            "string.empty": "name is required",
          }),
        description: Joi.string().required(),
        price: Joi.number().required(),
        discount_price: Joi.number(),
        colors: Joi.array().items(Joi.string()).min(1).required(),
        sizes: Joi.array().items(Joi.number()).min(1).required(),
        images: Joi.array().items(Joi.string().uri().required()).min(1).required(),
        delivery_info: Joi.string().required(),
        return_info: Joi.string().required(),
    })
    const { error } = expectedProductProperties.validate(obj)
    if (error) { 
        myconsole.log(error.message);
        res.json({ errorMessage: error.message });
        return error.message; 
    } else { 
        myconsole.log("exits"), 
        next() 
    }
});
exports.validateOrder = (obj,res) => {
    /*
    id, user_id, delivery_address, delivery_type(Door Delivery/Pick Up in Store), payment_method, voucher_code, total_amount
    */
    const myconsole = new Econsole("joi-validators.js", "validateOrder", "")
    myconsole.log("entry")
    myconsole.log(obj)
    var expectedOrderProperties = Joi.object({
        userId: Joi.string().required(),
        deliveryAddress: Joi.string().required(),
        deliveryType: Joi.string().valid('door delivery', 'pick up in store').required(),
        paymentMethod: Joi.string().optional().allow(''),
        voucherCode: Joi.string().optional().allow(''),
        totalAmount: Joi.number().required(),
        currency: Joi.string().required(),
        products: Joi.array().items(
          Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().required(),
            price: Joi.number().required(),
          })
        ).required(),
      });
    const { error } = expectedOrderProperties.validate(obj)
    if (error) { 
        myconsole.log(error.message);
        res.json({ errorMessage: error.message });
        myconsole.log("exits with false")
        return false; 
    } else { 
        myconsole.log("exits with true")
        return true;
    }
};
exports.validateReview = catchAsync(async (req, res, next) => {
  /*
  id, product_id, user_id, rating, comment, timestamp  
  */
  const myconsole = new Econsole("joi-validators.js", "validateReview", "")
  const { productId, userId, rating, comment} = req.body;
  console.log(productId, userId, rating, comment)
  const obj = { productId, userId, rating, comment}
  myconsole.log("entry")
  myconsole.log(obj)
  var expectedReviewProperties = Joi.object({
      userId: Joi.string().required(),
      productId: Joi.string().required(),
      rating: Joi.number().required().min(1).max(5),
      comment: Joi.string(),
    });
  const { error } = expectedReviewProperties.validate(obj)
  if (error) { 
      myconsole.log(error.message);
      res.json({ errorMessage: error.message });
      myconsole.log("exits with false")
      return false; 
  } else { 
      myconsole.log("exits with true")
      next();
  }
});
exports.validateVoucher = catchAsync(async (req, res, next) => {
    /*
    code, discountType, discountAmount, expiryDate, maxUses, usedCount
    */
    const myconsole = new Econsole("joi-validators.js", "validateVoucher", "")
    myconsole.log("entry")
    let code = req.body.code;
    if (!code) {
        code = crypto.randomBytes(3).toString('hex').slice(0, 3).toUpperCase();
        req.body.code = code;
    }
    const { discountType, discountAmount, expiryDate, maxUses, usedCount} = req.body;
    console.log(code, discountType, discountAmount, expiryDate, maxUses, usedCount)
    const obj = { code, discountType, discountAmount, expiryDate, maxUses, usedCount }
    var expectedVoucherProperties = Joi.object({
        code: Joi.string().required(),
        discountType: Joi.string().valid('percentage', 'fixed').required(),
        discountAmount: Joi.number().required(),
        expiryDate: Joi.date().required(),
        maxUses: Joi.number().required(),
        usedCount: Joi.number().default(0),
    })
    const { error } = expectedVoucherProperties.validate(obj)
    if (error) { 
        myconsole.log(error.message);
        res.json({ errorMessage: error.message });
        return error.message; 
    } else { 
        myconsole.log("exits"), 
        next() 
    }
});