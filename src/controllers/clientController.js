const Client = require("../models/Client");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const createClient = catchAsync(async (req, res) => {
    const client = await Client.create({
        ...req.body,
        assignedAgent: req.body.assignedAgent || req.user._id,
    });
    res.status(201).json(client);
});


const getClients = catchAsync(async (req, res) => {
    let filter = {};
    if (req.user.role === "agent") {
        filter.assignedAgent = req.user._id;
    }
    const clients = await Client.find(filter).populate("assignedAgent", "fullName email role");
    res.status(200).json(clients);
});


const getClientById = catchAsync(async (req, res) => {
    const client = await Client.findById(req.params.id).populate("assignedAgent", "fullName email role");
    if (!client) {
        throw new AppError("Client not found", 404);
    }
    if (req.user.role === "agent" && client.assignedAgent._id.toString() !== req.user._id.toString()) {
        throw new AppError("You do not have access to this client", 403);
    }
    res.status(200).json(client);
});


const updateClient = catchAsync(async (req, res) => {
    const client = await Client.findById(req.params.id);
    if (!client) {
        throw new AppError("Client not found", 404);
    }
    if (req.user.role === "agent" && client.assignedAgent.toString() !== req.user._id.toString()) {
        throw new AppError("You do not have access to this client", 403);
    }
    Object.assign(client, req.body);
    await client.save();
    res.status(200).json(client);
});


const deleteClient = catchAsync(async (req, res) => {
    const client = await Client.findById(req.params.id);
    if (!client) {
        throw new AppError("Client not found", 404);
    }
    await client.deleteOne();
    res.status(200).json({ message: "Client deleted" });
});


module.exports = {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
};