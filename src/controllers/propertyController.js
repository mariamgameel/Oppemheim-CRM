const Property = require("../models/Property");

const createProperty = async (req, res) => {
    try {
        const { building, floor, unitNumber, propertyType, price } = req.body;

        if (!building || floor === undefined || !unitNumber || !propertyType || !price) {
            return res.status(400).json({
                message: "building, floor, unitNumber, propertyType and price are required"
            });
        }
        const property = await Property.create(req.body);

        res.status(201).json(property);
    } catch (error) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "This unit already exists in this building/floor" });
        }
        res.status(500).json({ message: "Failed to create property", error: err.message });
    }
};


const getProperties = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        const properties = await Property.find(filter).populate("building", "name address");
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch properties", error: err.message });
    }
};


const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate("building", "name address");
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch property", error: err.message });
    }
};


const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        Object.assign(property, req.body);
        await property.save();
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: "Failed to update property", error: err.message });
    }
};


const updatePropertyStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["available", "reserved", "sold", "rented"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `status must be one of: ${validStatuses.join(", ")}`});
        }
        const property = await Property.findOneAndUpdate(
            { _id: req.params.id, status: { $nin: ["sold", "rented"] } },
            { status },
            { new: true }
        );
        if (!property) {
            return res.status(409).json({
                message: "This property is no longer available or was already updated by another agent",
            });
        }
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: "Failed to update property status", error: err.message });
    }
};


const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        await property.deleteOne();
        res.status(200).json({ message: "Property deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete property", error: err.message });
    }
};


module.exports = {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    updatePropertyStatus,
    deleteProperty,
};