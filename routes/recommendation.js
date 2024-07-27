const express = require("express");

const protect = require("../middlewares/protect");
const { recommendProducts } = require("../controllers/recommendation");

const router = express.Router();

// Protect rpoutes
router.use(protect);

// recommend route
router.get("/:productId", recommendProducts);

module.exports = router;
