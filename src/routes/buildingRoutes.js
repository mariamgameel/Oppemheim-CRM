const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/rbacMiddleware");
const { createBuilding, getBuildings } = require("../controllers/buildingController");
const router = express.Router();

router.use(protect);

router.post("/", authorizeRoles("admin", "team_lead"), createBuilding);
router.get("/", getBuildings);

module.exports = router;