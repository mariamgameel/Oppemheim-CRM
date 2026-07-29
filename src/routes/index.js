const express = require("express");
const authRoutes = require("./authRoutes");
const clientRoutes = require("./clientRoutes");
const buildingRoutes = require("./buildingRoutes");
const propertyRoutes = require("./propertyRoutes");
const dealRoutes = require("./dealRoutes");
const taskRoutes = require("./taskRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/clients", clientRoutes);
router.use("/buildings", buildingRoutes);
router.use("/properties", propertyRoutes);
router.use("/deals", dealRoutes);
router.use("/tasks", taskRoutes);

module.exports = router;