const express = require("express");
const router = express.Router();
const {
  createOrder,
  trackOrder,
  getAdminOrders,
  updateOrderStatus,
  createPaymentOrder,
  verifyPaymentOrder
} = require("../controllers/orderController");
const { authenticate, requireAdmin } = require("../middleware/authMiddleware");

// Public
router.post("/", createOrder);
router.get("/track", trackOrder);
router.post("/:id/create-payment", createPaymentOrder);
router.post("/:id/verify-payment", verifyPaymentOrder);

// Admin Only
router.get("/admin", authenticate, requireAdmin, getAdminOrders);
router.patch("/admin/:id/status", authenticate, requireAdmin, updateOrderStatus);

module.exports = router;
