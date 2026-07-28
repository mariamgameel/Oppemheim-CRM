const Building = require("../models/Building");

const createBuilding = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "name is required" });
        }
        const building = await Building.create(req.body);
        res.status(201).json(building);
    } catch (error) {
        res.status(500).json({ message: "Failed to create building", error: err.message });
    }
};


const getBuildings = async (req, res) => {
    try {
        const buildings = await Building.find();
        res.status(200).json(buildings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch buildings", error: err.message });
    }
};

module.exports = { createBuilding, getBuildings };