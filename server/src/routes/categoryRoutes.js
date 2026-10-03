const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");
const { authenticate, requireAdmin } = require("../middleware/authMiddleware");

// Public
router.get("/", getCategories);

// Admin Only
router.post("/admin", authenticate, requireAdmin, createCategory);
router.put("/admin/:id", authenticate, requireAdmin, updateCategory);
router.delete("/admin/:id", authenticate, requireAdmin, deleteCategory);

module.exports = router;
