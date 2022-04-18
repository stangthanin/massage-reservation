const express = require("express");
const {
  getMassageShops,
  createMassageShop,
  getMassageShop,
  updateMassageShop,
  deleteMassageShop,
} = require("../controllers/massageShop");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();
router
  .route("/")
  .get(getMassageShops)
  .post(protect, authorize("admin"), createMassageShop);
router
  .route("/:id")
  .get(getMassageShop)
  .patch(protect, authorize("admin"), updateMassageShop)
  .delete(protect, authorize("admin"), deleteMassageShop);

module.exports = router;
