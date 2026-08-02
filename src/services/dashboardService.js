const mongoose = require("mongoose");
const Deal = require("../models/Deal");

const buildDealDateFilter = (startDate, endDate) => {
    const filter = {};
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    return filter;
};


const getPipelineSummary = async ({ startDate, endDate, assignedAgent } = {}) => {
    const dateFilter = buildDealDateFilter(startDate, endDate);
    const baseMatch = { ...dateFilter, isClosed: false };
    if (assignedAgent) baseMatch.assignedAgent = new mongoose.Types.ObjectId(assignedAgent);
    const [byStage, byDealType, totals] = await Promise.all([
        Deal.aggregate([
            { $match: baseMatch },
            {
                $group: {
                    _id: "$stage",
                    count: { $sum: 1 },
                    totalValue: { $sum: "$dealValue" },
                },
            },
            { $project: { _id: 0, stage: "$_id", count: 1, totalValue: 1} },
            { $sort: { stage: 1 } },
        ]),
        Deal.aggregate([
            { $match: baseMatch },
            {
                $group: {
                    _id: "$dealType",
                    count: { $sum: 1 },
                    totalValue: { $sum: "$dealValue" },
                },
            },
            { $project: { _id: 0, dealType: "$_id", count: 1, totalValue: 1 } },
            { $sort: { dealType: 1} },
        ]),
        Deal.aggregate([
            { $match: baseMatch },
            {
                $group: {
                    _id: null,
                    totalPipelineValue: { $sum: "$dealValue" },
                    openDealCount: { $sum: 1 },
                },
            },
        ]),
    ]);
    return {
        totalPipelineValue: totals[0]?.totalPipelineValue || 0,
        openDealCount: totals[0]?.openDealCount || 0,
        byStage,
        byDealType,
    };
};


const getConversionRates = async ({ startDate, endDate, assignedAgent} = {}) => {
    const dateFilter = buildDealDateFilter(startDate, endDate);
    const baseMatch = { ...dateFilter };
    if (assignedAgent) baseMatch.assignedAgent = new mongoose.Types.ObjectId(assignedAgent);
    const [stageDistribution, totals] = await Promise.all([
        Deal.aggregate([
            { $match: baseMatch },
            { $group: { _id: "$stage", count: { $sum: 1 } } },
            { $project: { _id: 0, stage: "$_id", count: 1 } },
            { $sort: { stage: 1 } },
        ]),
        Deal.aggregate([
            { $match: baseMatch },
            {
                $group: {
                    _id: null,
                    totalDeals: { $sum: 1 },
                    closedDeals: { $sum: { $cond: ["$isClosed", 1, 0] } },
                },
            },
        ]),
    ]);
    const totalDeals = totals[0]?.totalDeals || 0;
    const closedDeals = totals[0]?.closedDeals || 0;
    const winRate = totalDeals > 0 ? Number(((closedDeals / totalDeals) * 100).toFixed(1)) : 0;
    return {
        totalDeals,
        closedDeals,
        winRate,
        stageDistribution,
    };
};


const getAgentLeaderboard = async ({ startDate, endDate } = {}) => {
    const dateFilter = buildDealDateFilter(startDate, endDate);
    const leaderboard = await Deal.aggregate([
        { $match: dateFilter },
        {
            $group: {
                _id: "$assignedAgent",
                totalDeals: { $sum: 1 },
                closedDeals: { $sum: { $cond: ["$isClosed", 1, 0] } },
                closedValue: {
                    $sum: { $cond: ["$isClosed", "$dealValue", 0] },
                },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "agent",
            },
        },
        { $unwind: "$agent" },
        {
            $project: {
                _id: 0,
                agentId: "$agent._id",
                fullName: "$agent.fullName",
                email: "$agent.email",
                totalDeals: 1,
                closedDeals: 1,
                closedValue: 1,
                conversionRate: {
                    $cond: [
                        { $gt: ["$totalDeals", 0] },
                        { $round: [{ $multiply: [{ $divide: ["$closedDeals", "$totalDeals"] }, 100] }, 1] },
                        0,
                    ],
                },
            },
        },
        { $sort: { closedValue: -1, closedDeals: -1} },
    ]);
    return leaderboard;
};

module.exports = { getPipelineSummary, getConversionRates, getAgentLeaderboard };