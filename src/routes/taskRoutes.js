const express = require("express");
const protect = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { createTaskSchema, updateTaskSchema } = require("../validators/taskValidators");
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

router.post("/", validate(createTaskSchema), createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.patch("/:id/complete", completeTask);
router.delete("/:id", deleteTask);

module.exports = router;