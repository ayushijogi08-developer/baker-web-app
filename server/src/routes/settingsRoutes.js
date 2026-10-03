const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { authenticate, requireAdmin } = require("../middleware/authMiddleware");

// Public
router.get("/", getSettings);

// Admin Only
router.put("/admin", authenticate, requireAdmin, updateSettings);

module.exports = router;
