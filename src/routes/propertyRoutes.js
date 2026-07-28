const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/rbacMiddleware");
const {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    updatePropertyStatus,
    deleteProperty,
} = require("../controllers/propertyController");
const router = express.Router();

router.use(protect);

router.post("/", createProperty);
router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.put("/:id", updateProperty);
router.patch("/:id/status", updatePropertyStatus);
router.delete("/:id", authorizeRoles("admin", "team_lead"), deleteProperty);

module.exports = router;