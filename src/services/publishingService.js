const propertyFinderClient = require("./channels/propertyFinderClient");
const bayutClient = require("./channels/bayutClient");
const companySiteClient = require("./channels/companySiteClient");
const AppError = require("../utils/AppError");

const CHANNEL_CLIENTS = {
    property_finder: propertyFinderClient,
    bayut: bayutClient,
    company_site: companySiteClient,
};

const publishToChannel = async (listing, channelName) => {
    const client = CHANNEL_CLIENTS[channelName];
    if (!client) {
        throw new AppError(`Unknown channel: ${channelName}`, 400);
    }
    try {
        const result = await client.publish(listing);
        return {
            channel: channelName,
            status: "published",
            externalListingId: result.externalListingId,
            lastSyncedAt: new Date(),
        };
    } catch (error) {
        return {
            channel: channelName,
            status: "failed",
            errorMessage: error.message,
            lastSyncedAt: new Date(),
        };
    }
};

const takeDownFromChannel = async (channelName, externalListingId) => {
    const client = CHANNEL_CLIENTS[channelName];
    if (!client) {
        throw new AppError(`Unknown channel: ${channelName}`, 400);
    }
    await client.takeDown(externalListingId);
    return {
        channel: channelName,
        status: "taken_down",
        lastSyncedAt: new Date(),
    };
};

module.exports = { publishToChannel, takeDownFromChannel, CHANNEL_CLIENTS };