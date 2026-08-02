const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/rbacMiddleware");
const validate = require("../middlewares/validate");
const { createBuildingSchema } = require("../validators/buildingValidators");
const { createBuilding, getBuildings } = require("../controllers/buildingController");
const router = express.Router();

router.use(protect);

router.post("/", authorizeRoles("admin", "team_lead"), validate(createBuildingSchema), createBuilding);
router.get("/", getBuildings);

module.exports = router;