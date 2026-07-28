const mongoose = require("mongoose");

const dealActivitySchema = new mongoose.Schema({
    deal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deal",
        required: true,
    },
    activityType: {
        type: String,
        enum: ["call", "email", "viewing", "note", "stage_change"],
        required: true,
    },
    notes: {
        type: String,
        trim: true,
    },
    loggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("DealActivity", dealActivitySchema);