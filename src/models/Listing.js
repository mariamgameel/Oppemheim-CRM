const mongoose = require("mongoose");

const channelStatusSchema = new mongoose.Schema({
    channel: {
        type: String,
        enum: ["property_finder", "bayut", "company_site"],
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "published", "failed", "taken_down"],
        default: "pending",
    },
    externalListId: {
        type: String,
    },
    lastSyncedAt: {
        type: Date,
    },
    errorMessage: {
        type: String,
    },
}, { _id: false });

const listingSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    channels: {
        type: [channelStatusSchema],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Listing", listingSchema);