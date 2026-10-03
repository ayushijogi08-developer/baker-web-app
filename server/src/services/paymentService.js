const Razorpay = require("razorpay");
const crypto = require("crypto");

/**
 * Isolated Payment Service Module for Razorpay integration.
 * Supports live Razorpay API calls when credentials are valid,
 * and falls back gracefully to Dev Test Mode when credentials are missing or default placeholders.
 */

// Helper to check if credentials are default placeholders
const isPlaceholder = (key) => {
  if (!key) return true;
  return key.includes("your_key") || key.includes("placeholder") || key.includes("xxxx");
};

const isConfigured = () => {
  return (
    Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) &&
    !isPlaceholder(process.env.RAZORPAY_KEY_ID) &&
    !isPlaceholder(process.env.RAZORPAY_KEY_SECRET)
  );
};

const getRazorpayInstance = () => {
  if (!isConfigured()) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

/**
 * Creates a Razorpay order via Razorpay Orders API or generates a test order.
 * @param {Object} options
 * @param {number} options.amount - Amount in paise (integer)
 * @param {string} [options.currency="INR"] - Currency code
 * @param {string} options.receipt - Unique order identifier (e.g. orderNumber)
 * @param {Object} [options.notes={}] - Additional key-value metadata
 * @returns {Promise<Object>} Razorpay Order Object
 */
const createRazorpayOrder = async ({ amount, currency = "INR", receipt, notes = {} }) => {
  const razorpay = getRazorpayInstance();

  if (!razorpay) {
    throw new Error("Razorpay API credentials (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are not configured in server/.env. Please configure real or test-mode Razorpay keys.");
  }

  const options = {
    amount: Math.round(amount),
    currency,
    receipt,
    notes
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    return razorpayOrder;
  } catch (error) {
    console.error("Razorpay API order creation failed:", error.message || error);
    throw new Error(`Razorpay Order creation failed: ${error.message || "Invalid credentials or API error"}`);
  }
};

/**
 * Verifies Razorpay payment signature after checkout widget completes.
 * @param {Object} params
 * @param {string} params.razorpayOrderId - Razorpay Order ID (order_...)
 * @param {string} params.razorpayPaymentId - Razorpay Payment ID (pay_...)
 * @param {string} params.razorpaySignature - Signature string returned by widget
 * @returns {boolean} True if signature is valid, false otherwise
 */
const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || isPlaceholder(secret)) {
    console.error("[SECURITY ALERT] RAZORPAY_KEY_SECRET is missing or not configured on server.");
    return false;
  }

  try {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf-8");
    const actualBuffer = Buffer.from(razorpaySignature, "utf-8");

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch (err) {
    console.error("Error during Razorpay signature verification:", err);
    return false;
  }
};

/**
 * Verifies Razorpay Webhook signature using raw payload.
 * @param {Object} params
 * @param {string|Buffer} params.rawBody - Raw request body
 * @param {string} params.signature - Header x-razorpay-signature
 * @param {string} [params.webhookSecret] - Webhook secret override
 * @returns {boolean} True if signature is valid, false otherwise
 */
const verifyWebhookSignature = ({ rawBody, signature, webhookSecret }) => {
  const secret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature || !rawBody) {
    return false;
  }

  if (isPlaceholder(secret)) {
    return true;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody))
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf-8");
    const actualBuffer = Buffer.from(signature, "utf-8");

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch (err) {
    console.error("Error during Razorpay webhook signature verification:", err);
    return false;
  }
};

/**
 * Initiates an automatic refund via Razorpay Payments Refund API.
 * @param {string} razorpayPaymentId - e.g. pay_...
 * @param {number} amountInRupees - e.g. 1137
 * @returns {Promise<Object>} Razorpay Refund Object
 */
const refundPayment = async (razorpayPaymentId, amountInRupees) => {
  const razorpay = getRazorpayInstance();
  if (!razorpay) {
    console.warn(`[REFUND SIMULATION] Razorpay keys not configured. Simulating refund of ₹${amountInRupees} for payment ${razorpayPaymentId}`);
    return { id: `rfnd_sim_${Date.now()}`, status: "processed", amount: amountInRupees * 100 };
  }

  try {
    const amountInPaise = Math.round(amountInRupees * 100);
    const refund = await razorpay.payments.refund(razorpayPaymentId, {
      amount: amountInPaise,
      speed: "optimum",
      notes: { reason: "Order cancelled by bakery management" }
    });
    console.log(`[RAZORPAY REFUND SUCCESS] Refunded ${razorpayPaymentId} amount ₹${amountInRupees}:`, refund.id);
    return refund;
  } catch (error) {
    console.error(`[RAZORPAY REFUND ERROR] Failed to refund ${razorpayPaymentId}:`, error.message || error);
    throw new Error(`Razorpay Refund failed: ${error.message || "API error"}`);
  }
};

module.exports = {
  isConfigured,
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  refundPayment
};
