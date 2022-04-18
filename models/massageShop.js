const mongoose = require("mongoose");

const MassageShopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  tel: {
    type: String,
    match: [
      /^[\+]?[(]?[0-9]{2,3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
      "Please add a valid phone number",
    ],
  },
  openTime: {
    type: String,
    required: [true, "Please add an open time"],
  },
  closeTime: {
    type: String,
    required: [true, "Please add a close time"],
  },
});

module.exports = mongoose.model("MassageShop", MassageShopSchema);
