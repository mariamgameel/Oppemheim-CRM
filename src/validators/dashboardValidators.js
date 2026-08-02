const Joi = require("joi");

const dashboardQuerySchema = Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref("startDate")),
});

module.exports = { dashboardQuerySchema };