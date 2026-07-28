const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Building",
        required: true,
    },
    floor: {
        type: Number,
        required: true,
    },
    unitNumber: {
        type: String,
        required: true,
        trim: true,
    },
    propertyType: {
        type: String,
        required: true,
    },
    bedrooms: Number,
    bathrooms: Number,
    squareFootage: Number,
    price: {
        type: Number,
        required: true,
    },
    photos: [{ type: String }],
    status: {
        type: String,
        enum: ["available", "reserved", "sold", "rented"],
        default: "available",
    },
}, { timestamps: true });

propertySchema.index({ building: 1, floor: 1, unitNumber: 1}, { unique: true});

module.exports = mongoose.model("Property", propertySchema);