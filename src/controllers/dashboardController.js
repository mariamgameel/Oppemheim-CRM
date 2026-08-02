const {
    getPipelineSummary,
    getConversionRates,
    getAgentLeaderboard,
} = require("../services/dashboardService");
const catchAsync = require("../utils/catchAsync");


const getSummary = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const filters = { startDate, endDate };
    if (req.user.role === "agent") {
        filters.assignedAgent = req.user._id;
    }
    const [pipeline, conversion] = await Promise.all([
        getPipelineSummary(filters),
        getConversionRates(filters),
    ]);
    res.status(200).json({ pipeline, conversion });
});


const getLeaderboard = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const leaderboard = await getAgentLeaderboard({ startDate, endDate });
    res.status(200).json(leaderboard);
});


module.exports = { getSummary, getLeaderboard };