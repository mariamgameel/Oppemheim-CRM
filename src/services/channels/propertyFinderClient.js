//MOCK
const publish = async (listing) => {
    console.log(`[PropertyFinder] Publishing listing: ${listing.title}`);
    return { success: true, externalListingId: `pf_${Date.now()}` };
};

const takeDown = async (externalListingId) => {
    console.log(`[PropertyFinder] Taking down listing: ${externalListingId}`);
    return { success: true };
};

module.exports = { publish, takeDown };