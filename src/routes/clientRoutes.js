const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/rbacMiddleware");
const {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
} = require("../controllers/clientController");

const router = express.Router();

router.use(protect);

router.post("/", createClient);
router.get("/", getClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", authorizeRoles("admin", "team_lead"), deleteClient);

module.exports = router;