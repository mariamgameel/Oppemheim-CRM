//MOCK
const publish = async (listing) => {
    console.log(`[CompanySite] Publishing listing: ${listing.title}`);
    return { success: true, externalListingId: `site_${listing._id}` };
};

const takeDown = async (externalListingId) => {
    console.log(`[CompanySite] Taking down listing: ${externalListingId}`);
    return { success: true };
};

module.exports = { publish, takeDown };