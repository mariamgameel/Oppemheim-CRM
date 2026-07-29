const Deal = require("../models/Deal");
const Property = require("../models/Property");
const DealActivity = require("../models/DealActivity");
const { createAutoFollowUpTask } = require("./taskService");

const VALID_STAGES = [
    "new_prospect",
    "pre_approved",
    "showing_touring",
    "offer_submitted",
    "under_contract",
    "closed",
];

const moveDealToStage = async (dealId, newStage, userId) => {
    if (!VALID_STAGES.includes(newStage)) {
        const err = new Error(`Invalid stage: ${newStage}`);
        err.statusCode = 400;
        throw err;
    }

    const deal = await Deal.findById(dealId);
    if (!deal) {
        const err = new Error("Deal not found");
        err.statusCode = 404;
        throw err;
    }

    const previousStage = deal.stage;
    deal.stage = newStage;

    if (newStage === "closed") {
        deal.isClosed = true;
        const updatedProperty = await Property.findOneAndUpdate(
            { _id: deal.property, status: { $nin: ["sold", "rented"] } },
            { status: deal.dealType === "rental" ? "rented" : "sold" },
            { new: true }
        );
        if (!updatedProperty) {
            const err = new Error("Property was already sold/rented - cannot close this deal");
            err.statusCode = 409;
            throw err;
        }
    }

    await deal.save();

    await DealActivity.create({
        deal: deal._id,
        activityType: "stage_change",
        notes: `Moved from "${previousStage}" to "${newStage}"`,
        loggedBy: userId,
    });

    await createAutoFollowUpTask(deal, userId);

    return deal;
};

module.exports = { moveDealToStage, VALID_STAGES};