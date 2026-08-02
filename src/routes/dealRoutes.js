const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/rbacMiddleware");
const validate = require("../middlewares/validate");
const {
    createDealSchema,
    updateDealSchema,
    changeStageSchema,
    logActivitySchema,
} = require("../validators/dealValidators");
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

router.post("/", validate(createDealSchema), createDeal);
router.get("/", getDeals);
router.get("/:id", getDealById);
router.put("/:id", validate(updateDealSchema), updateDeal);
router.patch("/:id/stage", validate(changeStageSchema), changeDealStage);
router.post("/:id/activities", validate(logActivitySchema), logActivity);
router.get("/:id/activities", getActivities);
router.delete("/:id", authorizeRoles("admin", "team_lead"), deleteDeal);

module.exports = router;