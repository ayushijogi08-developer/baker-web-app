const express = require("express");
const router = express.Router();
const { validateCoupon, getActiveCoupons, getCoupons, createCoupon, toggleCouponActive, deleteCoupon } = require("../controllers/couponController");
const { authenticate, requireAdmin } = require("../middleware/authMiddleware");

// Public
router.get("/active", getActiveCoupons);
router.get("/validate", validateCoupon);

// Admin Only
router.get("/admin", authenticate, requireAdmin, getCoupons);
router.post("/admin", authenticate, requireAdmin, createCoupon);
router.put("/admin/:id/toggle", authenticate, requireAdmin, toggleCouponActive);
router.delete("/admin/:id", authenticate, requireAdmin, deleteCoupon);

module.exports = router;
