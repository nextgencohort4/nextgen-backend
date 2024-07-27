const express = require("express");

const protect = require("../middlewares/protect");
const {
    addFavourite,
    getFavourites,
    removeFavourite,
} = require("../controllers/favourite");
const validate = require("../middlewares/validator");

const router = express.Router();

// Protect rpoutes
router.use(protect);

// favourite routes
router.post("/", validate("addFavourites"), addFavourite);
router.get("/", getFavourites);
router.delete("/:productId", removeFavourite);

module.exports = router;
