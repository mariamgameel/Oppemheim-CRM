const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/rbacMiddleware");
const {
    createDeal,
    getDeals,
    getDealById,
    updateDeal,
    changeDealStage,
    logActivity,
    getActivities,
    deleteDeal,
} = require("../controllers/dealController");
const router = express.Router();

router.use(protect);

router.post("/", createDeal);
router.get("/", getDeals);
router.get("/:id", getDealById);
router.put("/:id", updateDeal);
router.patch("/:id/stage", changeDealStage);
router.post("/:id/activities", logActivity);
router.get("/:id/activities", getActivities);
router.delete("/:id", authorizeRoles("admin", "team_lead"), deleteDeal);

module.exports = router;