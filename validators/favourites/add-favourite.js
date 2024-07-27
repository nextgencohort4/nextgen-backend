const Joi = require("joi");

const addFavouriteSchema = Joi.object({
    productId: Joi.string().required()
})

module.exports = addFavouriteSchema