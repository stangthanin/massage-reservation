const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  apptDateTime: {
    type: Date,
    required: [true, "Please add an appointment date and time"],
  },

  durationMinute: {
    type: Number,
    required: [true, "Please add an appointment duration (minute)"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  massageShop: {
    type: mongoose.Schema.ObjectId,
    ref: "MassageShop",
    required: true,
  },

  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.expots = mongoose.model("Appointment", AppointmentSchema);
