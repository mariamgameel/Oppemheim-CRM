const Task = require("../models/Task");

const createTask = async (req, res) => {
    try {
        const { title, dueDate } = req.body;
        if (!title || !dueDate) {
            return res.status(400).json({ message: "title and dueDate are required" });
        }
        const task = await Task.create({
            ...req.body,
            assignedAgent: req.body.assignedAgent || req.user._id,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to create task", error: err.message });
    }
};


const getTasks = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
    }
};


const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        .populate("relatedDeal", "dealType stage")
        .populate("relatedClient", "fullName");
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (req.user.role === "agent" && task.assignedAgent.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You do not have access to this task" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch task", error: err.message });
    }
};


const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (req.user.role === "agent" && task.assignedAgent.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You do not have access to this task"});
        }
        Object.assign(task, req.body);
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to update task", error: err.message });
    }
};


const completeTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: "completed" },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to complete task", error: err.message });
    }
};


const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await task.deleteOne();
        res.status(200).json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task", error: err.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    completeTask,
    deleteTask,
};