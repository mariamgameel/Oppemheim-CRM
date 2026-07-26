const Client = require("../models/Client");

const createClient = async (req, res) => {
    try {
        const { fullName, clientType } = req.body;

        if (!fullName || !clientType) {
            return res.status(400).json({ message: "fullname and client type are required"});
        }

        const client = await Client.create({
            ...req.body,
            assignedAgent: req.body.assignedAgent || req.user._id,
        });

        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ message: "Failed to create client", error: err.message });
    }
};

const getClients = async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === "agent") {
            filter.assignedAgent = req.user._id;
        }

        const clients = await Client.find(filter).populate("assignedAgent", "fullName email role");

        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch clients", error: err.message });
    }
};

const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).populate("assignedAgent", "fullName email role");

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        if (req.user.role === "agent" && client.assignedAgent._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You do not have access to this client" });
        }

        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch client", error: err.message });
    }
};

const updateClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        if (req.user.role === "agent" && client.assignedAgent.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You do not have access to this client", error: err.message });
        }

        Object.assign(client, req.body);
        await client.save();

        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Failed to update client", error: err.message });
    }
};

const deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        await client.deleteOne();

        res.status(200).json({ message: "Client deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete client", error: err.message });
    }
};

module.exports = {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
};