const mongoose = require("mongoose");
const MassageShop = require("./MassageShop");

const AppointmentSchema = new mongoose.Schema({
  apptDateTime: {
    type: Date,
    required: [true, "Please add an appointment date and time"],
    validate: {
      validator: apptDateTimeValidator,
      message: (props) =>
        `The shop is not open at ${new Date(
          props.value
        ).getUTCHours()}:${new Date(props.value).getUTCMinutes()} `,
    },
  },

  durationMinute: {
    type: Number,
    required: [true, "Please add an appointment duration (minute)"],
    validate: {
      validator: durationMinuteValidator,
      message: "Appoint duration is exceed the shop close time",
    },
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

async function apptDateTimeValidator(enterApptDateTime) {
  const massageShop = await MassageShop.findById(this.massageShop);

  hour = new Date(enterApptDateTime).getUTCHours();
  minute = new Date(enterApptDateTime).getUTCMinutes();

  return !(
    hour < massageShop.openTime.split(":")[0] ||
    (hour == massageShop.openTime.split(":")[0] &&
      minute < massageShop.openTime.split(":")[1])
  );
}

async function durationMinuteValidator(enterDurationMinute) {
  const massageShop = await MassageShop.findById(this.massageShop);

  hour = new Date(this.apptDateTime).getUTCHours();
  minute = new Date(this.apptDateTime).getUTCMinutes();

  console.log(massageShop, hour, minute);

  minute += enterDurationMinute;
  hour += Math.floor(minute / 60);
  minute %= 60;

  console.log(hour, minute);

  return !(
    hour > massageShop.closeTime.split(":")[0] ||
    (hour == massageShop.closeTime.split(":")[0] &&
      minute > massageShop.closeTime.split(":")[1])
  );
}

module.exports = mongoose.model("Appointment", AppointmentSchema);
