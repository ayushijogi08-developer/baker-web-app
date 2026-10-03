const prisma = require("../config/db");

const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required." });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() }
    });

    if (!coupon || !coupon.active) {
      return res.status(404).json({ message: "Invalid or inactive promo code." });
    }

    const cartAmount = parseFloat(amount) || 0;
    if (cartAmount < coupon.minimumOrder) {
      return res.status(400).json({ message: `Code requires a minimum order of ₹${coupon.minimumOrder}.` });
    }

    let discount = 0;
    if (coupon.type === "PERCENT") {
      discount = Math.round((cartAmount * coupon.value) / 100);
    } else {
      discount = coupon.value;
    }

    return res.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minimumOrder: coupon.minimumOrder,
      discount
    });
  } catch (error) {
    return res.status(500).json({ message: "Error validating coupon.", error: error.message });
  }
};

const getCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" }
    });
    return res.json(coupons);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching coupons.", error: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const { code, type, value, minimumOrder } = req.body;
    if (!code || !value) {
      return res.status(400).json({ message: "Code and value are required." });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        type: type || "PERCENT",
        value: parseFloat(value),
        minimumOrder: minimumOrder ? parseFloat(minimumOrder) : 0
      }
    });

    return res.status(201).json(coupon);
  } catch (error) {
    return res.status(500).json({ message: "Error creating coupon.", error: error.message });
  }
};

const toggleCouponActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: { active: active !== undefined ? Boolean(active) : !coupon.active }
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Error toggling coupon status.", error: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id } });
    return res.json({ message: "Coupon deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting coupon.", error: error.message });
  }
};

const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" }
    });
    return res.json(coupons);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching active coupons.", error: error.message });
  }
};

module.exports = {
  validateCoupon,
  getActiveCoupons,
  getCoupons,
  createCoupon,
  toggleCouponActive,
  deleteCoupon
};
