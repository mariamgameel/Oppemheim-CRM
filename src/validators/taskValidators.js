const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const createTaskSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200).required(),
    description: Joi.string().trim().max(2000),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid("low", "medium", "high", "urgent"),
    assignedAgent: objectId,
    relatedDeal: objectId,
    relatedClient: objectId,
    externalCalendarEventId: Joi.string().trim(),
    calendarProvider: Joi.string().valid("google", "outlook", null),
});

const updateTaskSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200),
    description: Joi.string().trim().max(2000),
    dueDate: Joi.date(),
    priority: Joi.string().valid("low", "medium", "high", "urgent"),
    status: Joi.string().valid("pending", "completed", "overdue"),
    assignedAgent: objectId,
    relatedDeal: objectId,
    relatedClient: objectId,
    externalCalendarEventId: Joi.string().trim(),
    calendarProvider: Joi.string().valid("google", "outlook", null),
}).min(1);

module.exports = { createTaskSchema, updateTaskSchema };