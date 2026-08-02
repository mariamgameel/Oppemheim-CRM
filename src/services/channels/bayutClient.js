//MOCK
const publish = async (listing) => {
    console.log(`[Bayut] Publishing listing: ${listing.title}`);
    return { success: true, externalListingId: `bayut_${Date.now()}` };
};

const takeDown = async (externalListingId) => {
    console.log(`[Bayut] Taking down listing: ${externalListingId}`);
    return { success: true };
};

module.exports = { publish, takeDown };