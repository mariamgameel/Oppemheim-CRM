const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/rbacMiddleware");
const validate = require("../middlewares/validate");
const {
    createPropertySchema,
    updatePropertySchema,
    updatePropertyStatusSchema,
} = require("../validators/propertyValidators");
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

router.post("/", validate(createPropertySchema), createProperty);
router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.put("/:id", validate(updatePropertySchema), updateProperty);
router.patch("/:id/status", validate(updatePropertyStatusSchema), updatePropertyStatus);
router.delete("/:id", authorizeRoles("admin", "team_lead"), deleteProperty);

module.exports = router;