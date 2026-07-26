const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    clientType: {
        type: String,
        enum: ["buyer", "seller", "landlord", "tenant"],
        required: true,
    },
    leadStatus: {
        type: String,
        enum: ["cold", "warm", "hot"],
        default: "cold",
    },
    preferences: {
        budgetMin: { type: Number },
        budgetMax: { type: Number },
        bedrooms: { type: Number },
        bathrooms: { type: Number },
        targetZipCodes: [{ type: String }],
        propertyType: { type: String },
    },
    assignedAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Client", clientSchema);