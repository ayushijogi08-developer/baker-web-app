const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const couponRoutes = require("./routes/couponRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const { handleRazorpayWebhook } = require("./controllers/orderController");

const app = express();

// CORS Configuration allowing any local dev port
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin or any localhost origin
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Webhook endpoint requires raw body for HMAC signature verification BEFORE express.json()
app.post(
  "/api/webhooks/razorpay",
  express.raw({ type: "*/*" }),
  (req, res, next) => {
    if (Buffer.isBuffer(req.body)) {
      req.rawBody = req.body.toString("utf8");
      try {
        req.body = JSON.parse(req.rawBody);
      } catch (e) {
        // Keep as raw string if JSON parsing fails
      }
    }
    next();
  },
  handleRazorpayWebhook
);

const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(uploadsDir));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", service: "The Hidden Bakers API Server" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled API Error:", err);
  res.status(500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err
  });
});

module.exports = app;
