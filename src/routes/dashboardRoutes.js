const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/rbacMiddleware");
const validate = require("../middlewares/validate");
const { dashboardQuerySchema } = require("../validators/dashboardValidators");
const { getSummary, getLeaderboard } = require("../controllers/dashboardController");

const router = express.Router();

router.use(protect);

router.get("/summary", validate(dashboardQuerySchema, "query"), getSummary);
router.get(
    "/leaderboard",
    authorizeRoles("senior_agent", "team_lead", "admin", "auditor"),
    validate(dashboardQuerySchema, "query"),
    getLeaderboard
);

module.exports = router;