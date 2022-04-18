const express = require("express");
const {
  getMassageShops,
  createMassageShop,
} = require("../controllers/massageShop");

const router = express.Router();
router.route("/").get(getMassageShops).post(createMassageShop);

module.exports = router;
