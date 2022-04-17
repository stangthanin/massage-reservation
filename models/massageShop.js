const mongoose = require("mongoose");

const massageShopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
  },
  openTime: {
    type: String,
  },
  closeTime: {
    type: String,
  },
});

module.exports = mongoose.model("massageShop", massageShopSchema);
