const mongoose = require("mongoose");

let timeRegex = new RegExp(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);

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
    match: [timeRegex, "Please add a valid time in format 00:00"],
  },

  closeTime: {
    type: String,
    required: [true, "Please add a close time"],
    match: [timeRegex, "Please add a valid time in format 00:00"],
    validate: {
      validator: closeTimeValidator,
      message: "Close time must be after the open time",
    },
  },
});

function closeTimeValidator(enterCloseTime) {
  return (
    this.openTime.split(":")[0] < enterCloseTime.split(":")[0] ||
    (this.openTime.split(":")[0] == enterCloseTime.split(":")[0] &&
      this.openTime.split(":")[1] < enterCloseTime.split(":")[1])
  );
}

module.exports = mongoose.model("MassageShop", MassageShopSchema);
