const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const createPropertySchema = Joi.object({
    building: objectId.required(),
    floor: Joi.number().integer().min(0).required(),
    unitNumber: Joi.string().trim().min(1).max(50).required(),
    propertyType: Joi.string().trim().min(1).max(50).required(),
    bedrooms: Joi.number().min(0),
    bathrooms: Joi.number().min(0),
    squareFootage: Joi.number().min(0),
    price: Joi.number().min(0).required(),
    photos: Joi.array().items(Joi.string().trim()),
    status: Joi.string().valid("available", "reserved", "sold", "rented"),
});

const updatePropertySchema = Joi.object({
    building: objectId,
    floor: Joi.number().integer().min(0),
    unitNumber: Joi.string().trim().min(1).max(50),
    propertyType: Joi.string().trim().min(1).max(50),
    bedrooms: Joi.number().min(0),
    bathrooms: Joi.number().min(0),
    squareFootage: Joi.number().min(0),
    price: Joi.number().min(0),
    photos: Joi.array().items(Joi.string().trim()),
    status: Joi.string().valid("available", "reserved", "sold", "rented"),
}).min(1);

const updatePropertyStatusSchema = Joi.object({
    status: Joi.string().valid("available", "reserved", "sold", "rented").required(),
});

module.exports = { createPropertySchema, updatePropertySchema, updatePropertyStatusSchema };