const Building = require("../models/Building");
const catchAsync = require("../utils/catchAsync");

const createBuilding = catchAsync(async (req, res) => {
    const building = await Building.create(req.body);
    res.status(201).json(building);
});


const getBuildings = catchAsync(async (req, res) => {
    const buildings = await Building.find();
    res.status(200).json(buildings);
});


module.exports = { createBuilding, getBuildings };