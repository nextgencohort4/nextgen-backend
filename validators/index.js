const register = require("./user/register");
const login = require("./user/login");
const update = require("./user/update");
const addToCart = require("./cart/add-to-cart");
const updateCart = require("./cart/update-cart");
const addFavourites = require("./favourites/add-favourite");

module.exports = { register, login, update, addToCart, updateCart, addFavourites };
