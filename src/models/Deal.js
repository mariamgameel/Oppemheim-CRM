const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
    dealType: {
        type: String,
        enum: ["rental", "secondary", "offplan"],
        required: true,
    },
    stage: {
        type: String,
        enum: [
            "new_prospect",
            "pre_approved",
            "showing_touring",
            "offer_submitted",
            "under_contract",
            "closed",
        ],
        default: "new_prospect",
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },
    assignedAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    dealValue: {
        type: Number,
        required: true,
    },
    winProbability: {
        type: Number,
        default: 50,
        min: 0,
        max: 100,
    },
    trackMetadata: {
        // rental track
        leaseStartDate: Date,
        leaseEndDate: Date,
        monthlyRent: Number,
        
        //secondary market track
        inspectionDate: Date,
        escrowStatus: String,
        negotiatedPrice: Number,

        //offplan track
        developerName: String,
        paymentPlan: String,
        constructionMilestone: String,
        expectedHandoverDate: Date,
    },
    isClosed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("Deal", dealSchema);