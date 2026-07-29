const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    completeTask,
    deleteTask,
} = require("../controllers/taskController");
const router = express.Router();

router.use(protect);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.patch("/:id/complete", completeTask);
router.delete("/:id", deleteTask);

module.exports = router;