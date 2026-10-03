const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  toggleStock,
  deleteProduct,
  validateCartItems
} = require("../controllers/productController");
const { authenticate, requireAdmin } = require("../middleware/authMiddleware");

// Public
router.get("/", getProducts);
router.post("/validate-cart", validateCartItems);
router.get("/:slug", getProductBySlug);

// Admin Only
router.post("/admin", authenticate, requireAdmin, createProduct);
router.put("/admin/:id", authenticate, requireAdmin, updateProduct);
router.patch("/admin/:id/stock", authenticate, requireAdmin, toggleStock);
router.delete("/admin/:id", authenticate, requireAdmin, deleteProduct);

module.exports = router;
