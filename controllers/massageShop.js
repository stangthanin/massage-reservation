const MassageShop = require("../models/MassageShop");

//Get all massage shops
exports.getMassageShops = async (req, res, next) => {
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over remove fields and delete them form reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  //console.log(reqQuery);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);

  //Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resourse
  query = MassageShop.find(JSON.parse(queryStr));

  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query;
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await MassageShop.countDocuments();
  query = query.skip(startIndex).limit(limit);

  try {
    //Executing query
    const massageShops = await query;
    //Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }
    res.status(200).json({
      success: true,
      count: massageShops.length,
      pagination,
      data: massageShops,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.createMassageShop = async (req, res, next) => {
  try {
    const messageShop = await MassageShop.create(req.body);
    res.status(201).json({ success: true, data: messageShop });
  } catch (err) {
    res.status(400).json({ success: false, data: err.message });
  }
};

exports.getMassageShop = async (req, res, next) => {
  try {
    const id = req.params["id"];
    const massageShop = await MassageShop.findById(id);
    if (!massageShop)
      return res.status(404).json({
        success: false,
        message: ` massage shop id ${id} is not found`,
      });
    res.status(200).json({ success: true, data: massageShop });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateMassageShop = async (req, res, next) => {
  try {
    const id = req.params["id"];
    const massageShop = await MassageShop.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!massageShop) {
      return res.status(404).json({
        success: false,
        message: ` massage shop id ${id} is not found`,
      });
    }
    res.status(200).json({ success: true, data: massageShop });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteMassageShop = async (req, res, next) => {
  try {
    const massageShop = await MassageShop.findById(req.params.id);

    if (!massageShop) {
      return res.status(404).json({
        success: false,
        message: `massage shop not found with id of ${req.params.id}`,
      });
    }
    massageShop.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
