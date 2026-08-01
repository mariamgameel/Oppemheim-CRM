const Joi = require("joi");
const { ROLES } = require("../utils/constants");

const registerSchema = Joi.object({
    fullName: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(6).max(72).required(),
    role: Joi.string().valid(...Object.values(ROLES)),
});

const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };