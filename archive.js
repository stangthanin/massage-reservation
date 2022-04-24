hour = new Date(req.body.apptDate).getUTCHours();
minute = new Date(req.body.apptDate).getUTCMinutes();

if (
  hour < massageShop.openTime.split(":")[0] ||
  (hour == massageShop.openTime.split(":")[0] &&
    minute < massageShop.openTime.split(":")[1])
) {
  return res.status(400).json({
    success: false,
    message: `The massage shop '${massageShop.name}' open at ${massageShop.openTime}`,
  });
}

minute += req.body.durationMinute;
hour += Math.floor(minute / 60);
minute %= 60;

if (
  hour > massageShop.closeTime.split(":")[0] ||
  (hour == massageShop.closeTime.split(":")[0] &&
    minute > massageShop.closeTime.split(":")[1])
) {
  return res.status(400).json({
    success: false,
    message: `The massage shop '${massageShop.name}' close at ${massageShop.closeTime}`,
  });
}

validate: [apptDateTimeValidator, "Start Date must be less than End Date"];

async function apptDateTimeValidator(enterApptDateTime) {
  const massageShop = await MassageShop.findById(this.massageShop);
  console.log(massageShop);

  hour = new Date(enterApptDateTime).getUTCHours();
  minute = new Date(enterApptDateTime).getUTCMinutes();

  return !(
    hour < massageShop.openTime.split(":")[0] ||
    (hour == massageShop.openTime.split(":")[0] &&
      minute < massageShop.openTime.split(":")[1])
  );
}
