const Appointment = require("../models/Appointment");
const MassageShop = require("../models/MassageShop");

exports.getAppointments = async (req, res, next) => {
  let query;

  if (req.user.role !== "admin") {
    query = Appointment.find({ user: req.user.id }).populate({
      path: "massageShop",
      select: "name address tel openTime closeTime",
    });
  } else {
    if (req.params.id) {
      query = Appointment.find({
        massageShop: req.params.id,
      }).populate({
        path: "massageShop",
        select: "name address tel openTime closeTime",
      });
    } else {
      query = Appointment.find().populate({
        path: "massageShop",
        select: "name address tel openTime closeTime",
      });
    }
  }

  try {
    const appointments = await query;
    res
      .status(200)
      .json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "Cannot find Appointment" });
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate({
      path: "massageShop",
      select: "name address tel openTime closeTime",
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.massageShopId}`,
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "Cannot find Appointment" });
  }
};

exports.addAppointment = async (req, res, next) => {
  try {
    req.body.massageShop = req.params.massageShopId;

    const massageShop = await MassageShop.findById(req.params.massageShopId);

    if (!massageShop) {
      return res.status(404).json({
        success: false,
        message: `No massage shop with the id of ${req.params.massageShopId}`,
      });
    }

    if (req.user.role !== "admin") {
      // require user id if appoint by admin
      req.body.user = req.user.id;
    }

    const existedAppointment = await Appointment.find({ user: req.user.id });

    if (existedAppointment.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 appointments`,
      });
    }

    const appointment = await Appointment.create(req.body);

    res.status(200).json({
      success: true,
      data: appointment,
      totalAppointment: existedAppointment.length + 1,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Cannot create Appointment",
      error: error.message,
    });
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.id}`,
      });
    }

    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this appointment`,
      });
    }

    req.body.user = req.user.id;
    req.body.massageShop = appointment.massageShop;

    console.log(req.body);

    const updateAppointment = await Appointment.create(req.body);
    await appointment.remove();

    res.status(200).json({ success: true, data: updateAppointment });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Cannot update Appointment",
      error: error.message,
    });
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.id}`,
      });
    }

    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this Appointment`,
      });
    }

    await appointment.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Appointment" });
  }
};
