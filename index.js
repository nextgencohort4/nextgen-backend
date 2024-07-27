// load dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const ErrorHandler = require("./middlewares/error-handler");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const favouriteRoutes = require("./routes/favourite");
const recommendRoutes = require("./routes/recommendation");

//product-management
const productRoutes = require("./routes/product-route");

//review-management
const reviewRoutes = require("./routes/review-route");

//checkout & order
const checkoutRoutes = require("./routes/checkout-route.js");

//voucher
const voucherRoutes = require("./routes/voucher-route.js");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/recommend/", recommendRoutes);

app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/order", checkoutRoutes);
app.use("/api/vouchers", voucherRoutes);


app.use("*", (req, res, next) => {
  console.log(`route ${req.baseUrl} not found`);

  res.status(404).json({ message: "not found" });
});

// Error Handler
app.use(ErrorHandler);

module.exports = app;
