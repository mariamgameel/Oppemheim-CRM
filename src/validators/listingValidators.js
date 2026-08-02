const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const createListingSchema = Joi.object({
    property: objectId.required(),
    title: Joi.string().trim().min(1).max(200).required(),
    description: Joi.string().trim().max(2000),
});

const publishListingSchema = Joi.object({
    channels: Joi.array()
    .items(Joi.string().valid("property_finder", "bayut", "company_site"))
    .min(1)
    .required(),
});

module.exports = { createListingSchema, publishListingSchema };