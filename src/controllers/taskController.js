const Task = require("../models/Task");
const catcAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const createTask = catchAsync(async (req, res) => {
    const task = await Task.create({
        ...req.body,
        assignedAgent: req.body.assignedAgent || req.user._id,
    });
    res.status(201).json(task);
});


const getTasks = catchAsync(async (req, res) => {
    const filter = {};
    if (req.user.role === "agent") {
        filter.assignedAgent = req.user._id;
    }
    if (req.query.status) filter.status = req.query.status;
    const tasks = await Task.find(filter)
    .populate("relatedDeal", "dealType stage")
    .populate("relatedClient", "fullName")
    .sort({ dueDate: 1 });
    const now = new Date();
    const withComputedStatus = tasks.map((t) => {
        const obj = t.toObject();
        if (obj.status === "pending" && new Date(obj.dueDate) < now) {
            obj.status = "overdue";
        }
        return obj;
    });
    withComputedStatus.sort((a, b) => {
        if (a.status === "overdue" && b.status !== "overdue") return -1;
        if (b.status === "overdue" && a.status !== "overdue") return 1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
    res.status(200).json(withComputedStatus);
});


const getTaskById = catchAsync(async (req, res) => {
    const task = await Task.findById(req.params.id)
    .populate("relatedDeal", "dealType stage")
    .populate("relatedClient", "fullName");
    if (!task) {
        throw new AppError("Task not found", 404);
    }
    if (req.user.role === "agent" && task.assignedAgent.toString() !== req.user._id.toString()) {
        throw new AppError("You do not have access to this task", 403);
    }
    res.status(200).json(task);
});


const updateTask = catchAsync(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        throw new AppError("Task not found", 404);
    }
    if (req.user.role === "agent" && task.assignedAgent.toString() !== req.user._id.toString()) {
        throw new AppError("You do not have access to this task", 403);
    }
    Object.assign(task, req.body);
    await task.save();
    res.status(200).json(task);
});


const completeTask = catchAsync(async (req, res) => {
    const task = await Task.findByIdAndUpdate(
        req.params.id,
        { status: "completed" },
        { new: true }
    );
    if (!task) {
        throw new ApError("Task not found", 404);
    }
    res.status(200).json(task);
});


const deleteTask = catchAsync(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        throw new AppError("Task not found", 404);
    }
    await task.deleteOne();
    res.status(200).json({ message: "Task deleted" });
});


module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    completeTask,
    deleteTask,
};