const Deal = require("../models/Deal");
const DealActivity = require("../models/DealActivity");
const { moveDealToStage } = require("../services/pipelineService");

const createDeal = async (req, res) => {
    try {
        const { dealType, client, property, dealValue } = req.body;

        if (!dealType || !client || !property || !dealValue) {
            return res.status(400).json({
                message: "dealType, client, property and dealValue are required",
            });
        }

        const deal = await Deal.create({
            ...req.body,
            assignedAgent: req.body.assignedAgent || req.user._id,
        });

        res.status(201).json(deal);
    } catch (error) {
        res.status(500).json({ message: "Failed to create deal", error: err.message });
    }
};


const getDeals = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch deals", error: err.message });
    }
};


const getDealById = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id)
        .populate("client")
        .populate("property")
        .populate("assignedAgent", "fullName email");

        if (!deal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        if (req.user.role === "agent" && deal.assignedAgent._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You do not have access to this deal"});
        }

        res.status(200).json(deal);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch deal", error: err.message });
    }
};


const updateDeal = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        if (req.user.role === "agent" && deal.assignedAgent._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You do not have access to this deal" });
        }

        delete req.body.stage;
        Object.assign(deal, req.body);
        await deal.save();
        res.status(200).json(deal);
    } catch (error) {
        res.status(500).json({ message: "Failed to update deal", error: err.message });
    }
};


const changeDealStage = async (req, res) => {
    try {
        const { stage } = req.body;

        if (!stage) {
            return res.status(400).json({ message: "stage is required" });
        }

        const deal = await moveDealToStage(req.params.id, stage, req.user._id);
        res.status(200).json(deal);
    } catch (error) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};


const logActivity = async (req, res) => {
    try {
        const { activityType, notes } = req.body;

        if (!activityType) {
            return res.status(400).json({ message: "activityType is required" });
        }

        const activity = await DealActivity.create({
            deal: req.params.id,
            activityType,
            notes,
            loggedBy: req.user._id,
        });

        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: "Failed to log activity", error: err.message });
    }
};


const getActivities = async (req, res) => {
    try {
        const activities = await DealActivity.find({ deal: req.params.id })
        .populate("loggedBy", "fullName")
        .sort({ createdAt: -1 });

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch activities", error: err.message });
    }
};


const deleteDeal = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        await deal.deleteOne();
        res.status(200).json({ message: "Deal deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete deal", error: err.message });
    }
};


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