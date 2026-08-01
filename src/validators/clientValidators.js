const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const preferencesSchema = Joi.object({
    budgetMin: Joi.number().min(0),
    budgetMax: Joi.number().min(0),
    bedrooms: Joi.number().min(0),
    bathrooms: Joi.number().min(0),
    targetZipCodes: Joi.array().items(Joi.string().trim()),
    propertyType: Joi.string().trim(),
});

const createClientSchema = Joi.object({
    fullName: Joi.string().trim().min(2).max(150).required(),
    email: Joi.string().trim().lowercase().email(),
    phone: Joi.string().trim().max(30),
    clientType: Joi.string().valid("buyer", "seller", "landlord", "tenant").required(),
    leadStatus: Joi.string().valid("cold", "warm", "hot"),
    preferences: preferencesSchema,
    assignedAgent: objectId,
});

const updateClientSchema = Joi.object({
    fullName: Joi.string().trim().min(2).max(150),
    email: Joi.string().trim().lowercase().email(),
    phone: Joi.string().trim().max(30),
    clientType: Joi.string().valid("buyer", "seller", "landlord", "tenant"),
    leadStatus: Joi.string().valid("cold", "warm", "hot"),
    preferences: preferencesSchema,
    assignedAgent: objectId,
}).min(1);

module.exports = { createClientSchema, updateClientSchema };