const Property = require("../models/Property");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const createProperty = catchAsync(async (req, res) => {
    const property = await Property.create(req.body);
    res.status(201).json(property);
});


const getProperties = catchAsync(async (req, res) => {
    const filter = {};
    if (req.query.status) {
        filter.status = req.query.status;
    }
    const properties = await Property.find(filter).populate("building", "name address");
    res.status(200).json(properties);
});


const getPropertyById = catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id).populate("building", "name address");
    if (!property) {
        throw new AppError("Property not found", 404);
    }
    res.status(200).json(property);
});


const updateProperty = catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) {
        throw new AppError("Property not found", 404);
    }
    Object.assign(property, req.body);
    await property.save();
    res.status(200).json(property);
});


const updatePropertyStatus = catchAsync(async (req, res) => {
    const { status } = req.body;
    const property = await Property.findOneAndUpdate(
        { _id: req.params.id, status: { $nin: ["sold", "rented"] } },
        { status },
        { new: true }
    );
    if (!property) {
        throw new AppError(
            "This property is no longer available or was already updated by another agent",
            409
        );
    }
    res.status(200).json(property);
});


const deleteProperty = catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) {
        throw new AppError("Property not found", 404);
    }
    await property.deleteOne();
    res.status(200).json({ message: "Property deleted" });
});


module.exports = {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    updatePropertyStatus,
    deleteProperty,
};