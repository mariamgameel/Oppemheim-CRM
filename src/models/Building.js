const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    totalFloors: {
        type: Number,
    },
}, { timestamps: true });

module.exports = mongoose.model("Building", buildingSchema);