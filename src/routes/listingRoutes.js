const express = require("express");
const protect = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { createListingSchema, publishListingSchema } = require("../validators/listingValidators");
const {
    createListing,
    getListings,
    getListingById,
    publishListing,
    takeDownListing,
} = require("../controllers/listingController");

const router = express.Router();

router.use(protect);

router.post("/", validate(createListingSchema), createListing);
router.get("/", getListings);
router.get("/:id", getListingById);
router.post("/:id/publish", validate(publishListingSchema), publishListing);
router.post("/:id/takedown", takeDownListing);

module.exports = router;