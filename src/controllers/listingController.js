const Listing = require("../models/Listing");
const { publishToChannel, takeDownFromChannel } = require("../services/publishingService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const createListing = catchAsync(async (req, res) => {
    const listing = await Listing.create({
        ...req.body,
        createdBy: req.user._id,
        channels: [],
    });
    res.status(201).json(listing);
});


const getListings = catchAsync(async (req, res) => {
    const listings = await Listing.find()
    .populate("property", "unitNumber floor price status")
    .populate("createdBy", "fullName");
    res.status(200).json(listings);
});


const getListingById = catchAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id)
    .populate("property")
    .populate("createdBy", "fullName");
    if (!listing) {
        throw new AppError("Listing not found", 404);
    }
    res.status(200).json(listing);
});


const publishListing = catchAsync(async (req, res) => {
    const { channels } = req.body;
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new AppError("Listing not found", 404);
    }
    const results = await Promise.all(
        channels.map((channelName) => publishToChannel(listing, channelName))
    );
    results.forEach((results) => {
        const existingIndex = listing.channels.findIndex((c) => c.channel === result.channel);
        if (existingIndex >= 0) {
            listing.channels[existingIndex] = result;
        } else {
            listing.channels.push(result);
        }
    });
    await listing.save();
    res.status(200).json(listing);
});


const takeDownListing = catchAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new AppError("Listing not found", 404);
    }
    const publishedChannels = listing.channels.filter((c) => c.status === "published");
    const results = await Promise.all(
        publishedChannels.map((c) => takeDownFromChannel(c.channel, c.externalListingId))
    );
    results.forEach((result) => {
        const idx = listing.channels.findIndex((c) => c.channel === result.channel);
        if (idx >= 0) listing.channels[idx] = { ...listing.channels[idx].toObject(), ...result};
    });
    listing.isActive = false;
    await listing.save();
    res.status(200).json(listing);
});


module.exports = {
    createListing,
    getListings,
    getListingById,
    publishListing,
    takeDownListing,
};