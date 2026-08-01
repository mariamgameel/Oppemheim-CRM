const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const DEAL_STAGES = [
    "new_prospect",
    "pre_approved",
    "showing_touring",
    "offer_submitted",
    "under_contract",
    "closed",
];

const trackMetadataSchema = Joi.object({
    leaseStartDate: Joi.date(),
    leaseEndDate: Joi.date(),
    monthlyRent: Joi.number().min(0),

    inspectionDate: Joi.date(),
    escrowStatus: Joi.string().trim(),
    negotiatedPrice: Joi.number().min(0),

    developerName: Joi.string().trim(),
    paymentPlan: Joi.string().trim(),
    constructionMilestone: Joi.string().trim(),
    expectedHandoverDate: Joi.date(),
});

const createDealSchema = Joi.object({
    dealType: Joi.string().valid("rental", "secondary", "offplan").required(),
    client: objectId.required(),
    property: objectId.required(),
    assignedAgent: objectId,
    dealValue: Joi.number().min(0).required(),
    winProbability: Joi.number().min(0).max(100),
    trackMetadata: trackMetadataSchema,
});

const updateDealSchema = Joi.object({
    dealType: Joi.string().valid("rental", "secondary", "offplan"),
    client: objectId,
    property: objectId,
    assignedAgent: objectId,
    dealValue: Joi.number().min(0),
    winProbability: Joi.number().min(0).max(100),
    trackMetadata: trackMetadataSchema,
}).min(1);

const changeStageSchema = Joi.object({
    stage: Joi.string().valid(...DEAL_STAGES).required(),
});

const logActivitySchema = Joi.object({
    activityType: Joi.string().valid("call", "email", "viewing", "note", "stage_change").required(),
    notes: Joi.string().trim().max(2000),
});

module.exports = {
    createDealSchema,
    updateDealSchema,
    changeStageSchema,
    logActivitySchema,
};