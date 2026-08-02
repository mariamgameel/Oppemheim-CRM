const Deal = require("../models/Deal");
const DealActivity = require("../models/DealActivity");
const { moveDealToStage } = require("../services/pipelineService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const createDeal = catchAsync(async (req, res) => {
    const deal = await Deal.create({
        ...req.body,
        assignedAgent: req.body.assignedAgent || req.user._id,
    });
    res.status(201).json(deal);
});


const getDeals = catchAsync(async (req, res) => {
    const filter = {};
    if (req.user.role === "agent") {
        filter.assignedAgent = req.user._id;
    }
    if (req.query.dealType) filter.dealType = req.query.dealType;
    if (req.query.stage) filter.stage = req.query.stage;
    const deals = await Deal.find(filter)
    .populate("client", "fullName clientType leadStatus")
    .populate("property", "unitNumber floor price status")
    .populate("assignedAgent", "fullName email");
    res.status(200).json(deals);
});


const getDealById = catchAsync(async (req, res) => {
    const deal = await Deal.findById(req.params.id)
    .populate("client")
    .populate("property")
    .populate("assignedAgent", "fullName email");
    if (!deal) {
        throw new AppError("Deal not found", 404);
    }
    if (req.user.role === "agent" && deal.assignedAgent._id.toString() !== req.user._id.toString()) {
        throw new AppError("You do not have access to this deal", 403);
    }
    res.status(200).json(deal);
});


const updateDeal = catchAsync(async (req, res) => {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
        throw new AppError("Deal not found", 404);
    }
    if (req.user.role === "agent" && deal.assignedAgent._id.toString() !== req.user._id.toString()) {
        throw new AppError("You do not have access to this deal", 403);
    }
    delete req.body.stage;
    Object.assign(deal, req.body);
    await deal.save();
    res.status(200).json(deal);
});


const changeDealStage = catchAsync(async (req, res) => {
    const { stage } = req.body;
    const deal = await moveDealToStage(req.params.id, stage, req.user._id);
    res.status(200).json(deal);
});


const logActivity = catchAsync(async (req, res) => {
    const { activityType, notes } = req.body;
    const activity = await DealActivity.create({
        deal: req.params.id,
        activityType,
        notes,
        loggedBy: req.user._id,
    });
    res.status(201).json(activity);
});


const getActivities = catchAsync(async (req, res) => {
    const activities = await DealActivity.find({ deal: req.params.id })
    .populate("loggedBy", "fullName")
    .sort({ createdAt: -1 });
    res.status(200).json(activities);
});


const deleteDeal = catchAsync(async (req, res) => {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
        throw new AppError("Deal not found", 404);
    }
    await deal.deleteOne();
    res.status(200).json({ message: "Deal deleted" });
});


module.exports = {
    createDeal,
    getDeals,
    getDealById,
    updateDeal,
    changeDealStage,
    logActivity,
    getActivities,
    deleteDeal,
};