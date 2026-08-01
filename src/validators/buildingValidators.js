const Joi = require("joi");

const createBuildingSchema = Joi.object({
    name: Joi.string().trim().min(1).max(150).required(),
    address: Joi.string().trim().max(300),
    totalFloors: Joi.number().integer().min(1),
});

module.exports = { createBuildingSchema };