const Deal = require("../models/Deal");
const Property = require("../models/Property");
const DealActivity = require("../models/DealActivity");
const Listing = require("../models/Listing");
const { createAutoFollowUpTask } = require("./taskService");
const { takeDownFromChannel } = require("./publishingService");
const AppError = require("../utils/AppError");

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
        throw new AppError(`Invalid stage: ${newStage}`, 400);
    }

    const deal = await Deal.findById(dealId);
    if (!deal) {
        throw new AppError("Deal not found", 404);
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
            throw new AppError("Property was already sold/rented - cannot close this deal", 409);
        }

        const listing = await Listing.findOne({ property: deal.property, isActive: true });
        if (listing) {
            const publishedChannels = listing.channels.filter((c) => c.status === "published");
            const results = await Promise.all(
                publishedChannels.map((c) => takeDownFromChannel(c.channel, c.externalListingId))
            );
            results.forEach((result) => {
                const idx = listing.channels.findIndex((c) => c.channel === result.channel);
                if (idx >= 0) listing.channels[idx] = { ...listing.channels[idx].toObject(), ...result };
            });
            listing.isActive = false;
            await listing.save();
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