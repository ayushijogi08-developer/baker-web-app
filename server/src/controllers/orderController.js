const prisma = require("../config/db");
const { generateOrderNumber } = require("../utils/orderNumber");
const paymentService = require("../services/paymentService");

// Public Guest Checkout
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      orderType, // 'DELIVERY' | 'PICKUP'
      deliveryAddress,
      scheduledDate,
      scheduledTime,
      paymentMethod,
      couponCode,
      notes,
      deliveryFee: clientDeliveryFee, // Optional client calculated total delivery fee
      items // Array of { productId, slug, name, sizeLabel, quantity }
    } = req.body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({ message: "Customer name, phone number, and items are required." });
    }

    if (orderType === "DELIVERY" && !deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required for home delivery orders." });
    }

    // 1. Fetch Store Settings for Delivery Charges, Operating Window & Thresholds
    let storeSettings = await prisma.storeSettings.findUnique({ where: { id: "default" } });
    if (!storeSettings) {
      storeSettings = {
        deliveryFee: 40,
        freeDeliveryThreshold: 500,
        minOrderAmount: 100,
        openingTime: "09:00",
        closingTime: "22:00",
        isStoreOpenManualOverride: null,
        storeClosedNotice: "Store is currently closed for delivery & orders."
      };
    }

    // Check Store Operating Window
    const isStoreClosed = (settings) => {
      if (settings.isStoreOpenManualOverride === false) return true;
      if (settings.isStoreOpenManualOverride === true) return false;
      if (!settings.openingTime || !settings.closingTime) return false;

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const [openH, openM] = settings.openingTime.split(":").map(Number);
      const [closeH, closeM] = settings.closingTime.split(":").map(Number);

      const openMinutes = openH * 60 + openM;
      const closeMinutes = closeH * 60 + closeM;

      return currentMinutes < openMinutes || currentMinutes >= closeMinutes;
    };

    if (isStoreClosed(storeSettings)) {
      return res.status(400).json({
        message: storeSettings.storeClosedNotice || `Store is currently closed for delivery & orders. Operating hours: ${storeSettings.openingHours || '9:00 AM - 10:00 PM'}`
      });
    }

    // 2. Re-fetch each product from Database and Validate Stock & Prices
    let calculatedSubtotal = 0;
    const validatedOrderItems = [];

    for (const item of items) {
      let product = null;

      // Primary lookup by Product ID
      if (item.productId) {
        product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { sizes: true }
        });
      }

      // Fallback lookup by slug or exact name
      if (!product) {
        const searchTerms = [item.slug, item.name, item.productId].filter(Boolean);
        if (searchTerms.length > 0) {
          product = await prisma.product.findFirst({
            where: {
              OR: [
                ...searchTerms.map((t) => ({ slug: t })),
                ...searchTerms.map((t) => ({ name: t }))
              ]
            },
            include: { sizes: true }
          });
        }
      }

      if (!product || !product.active) {
        return res.status(400).json({
          message: `Product '${item.name || item.productId}' is currently unavailable.`
        });
      }

      if (product.isOutOfStock || product.stockStatus === "OUT_OF_STOCK" || product.stockQuantity <= 0) {
        return res.status(400).json({
          message: `Sorry! '${product.name}' is currently out of stock.`
        });
      }

      const qty = parseInt(item.quantity) || 1;

      if (product.stockQuantity < qty) {
        return res.status(400).json({
          message: `Sorry! Only ${product.stockQuantity} units of '${product.name}' remain in stock.`
        });
      }

      // Determine unit price
      let unitPrice = product.discountPrice || product.price;
      let selectedSizeLabel = item.sizeLabel || "Standard";

      if (item.sizeLabel && product.sizes && product.sizes.length > 0) {
        const matchedSize = product.sizes.find((s) => s.label === item.sizeLabel);
        if (matchedSize && matchedSize.priceOverride) {
          unitPrice = matchedSize.priceOverride;
        }
      }

      const lineTotal = unitPrice * qty;
      calculatedSubtotal += lineTotal;

      validatedOrderItems.push({
        productId: product.id,
        productNameSnapshot: product.name,
        sizeLabelSnapshot: selectedSizeLabel,
        unitPriceSnapshot: unitPrice,
        quantity: qty,
        lineTotal
      });
    }

    if (calculatedSubtotal < storeSettings.minOrderAmount) {
      return res.status(400).json({ message: `Minimum order amount is ₹${storeSettings.minOrderAmount}.` });
    }

    // 3. Server-side Coupon Discount Calculation
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() }
      });

      if (coupon && coupon.active && calculatedSubtotal >= coupon.minimumOrder) {
        if (coupon.type === "PERCENT") {
          discountAmount = Math.round((calculatedSubtotal * coupon.value) / 100);
        } else if (coupon.type === "FLAT") {
          discountAmount = coupon.value;
        }
      }
    }

    // 4. Delivery Charge Calculation (Honors Distance Surcharges)
    let effectiveDeliveryFee = 0;
    if (orderType === "DELIVERY") {
      if (clientDeliveryFee !== undefined && clientDeliveryFee !== null) {
        effectiveDeliveryFee = parseFloat(clientDeliveryFee) || 0;
      } else {
        effectiveDeliveryFee = calculatedSubtotal >= storeSettings.freeDeliveryThreshold ? 0 : storeSettings.deliveryFee;
      }
    }

    const grandTotal = Math.max(0, calculatedSubtotal - discountAmount + effectiveDeliveryFee);

    // 5. Find or Create Customer
    const normalizedPhone = customerPhone.trim().replace(/\s+/g, "");
    let customer = await prisma.customer.findUnique({
      where: { phone: normalizedPhone }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName.trim(),
          phone: normalizedPhone,
          email: customerEmail ? customerEmail.trim() : null
        }
      });
    } else {
      await prisma.customer.update({
        where: { id: customer.id },
        data: { name: customerName.trim(), ...(customerEmail && { email: customerEmail.trim() }) }
      });
    }

    // 6. Generate unique order number e.g. THB-8492
    let orderNum = generateOrderNumber();
    let existing = await prisma.order.findUnique({ where: { orderNumber: orderNum } });
    while (existing) {
      orderNum = generateOrderNumber();
      existing = await prisma.order.findUnique({ where: { orderNumber: orderNum } });
    }

    // 7. Save Order and OrderItems atomically
    const newOrder = await prisma.order.create({
      data: {
        orderNumber: orderNum,
        customerId: customer.id,
        subtotal: calculatedSubtotal,
        deliveryFee: effectiveDeliveryFee,
        discount: discountAmount,
        total: grandTotal,
        orderType: orderType === "PICKUP" ? "PICKUP" : "DELIVERY",
        deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : null,
        scheduledDate: scheduledDate || "Today",
        scheduledTime: scheduledTime || "ASAP",
        paymentMethod: paymentMethod || "upi_delivery",
        paymentStatus: "PENDING",
        orderStatus: paymentMethod === "online" ? "PAYMENT_PENDING" : "CONFIRMED",
        notes: notes ? notes.trim() : null,
        items: {
          create: validatedOrderItems
        }
      },
      include: {
        customer: true,
        items: true
      }
    });

    // 8. If offline payment (Cash/UPI on Delivery), decrement stock immediately
    if (paymentMethod !== "online") {
      for (const item of validatedOrderItems) {
        if (item.productId) {
          try {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (product) {
              const newStock = Math.max(0, product.stockQuantity - item.quantity);
              const isNowOutOfStock = newStock <= 0;
              await prisma.product.update({
                where: { id: product.id },
                data: {
                  stockQuantity: newStock,
                  isOutOfStock: isNowOutOfStock,
                  stockStatus: isNowOutOfStock ? "OUT_OF_STOCK" : "IN_STOCK"
                }
              });
            }
          } catch (e) {
            console.error("Error updating stock quantity:", e);
          }
        }
      }
    }

    return res.status(201).json({
      message: "Order created successfully.",
      order: newOrder
    });
  } catch (error) {
    return res.status(500).json({ message: "Error processing order.", error: error.message });
  }
};

// Admin List Orders
const getAdminOrders = async (req, res) => {
  try {
    const { status, search } = req.query;

    const where = {};

    if (status && status !== "ALL") {
      where.orderStatus = status;
    } else {
      where.orderStatus = { not: "PAYMENT_PENDING" };
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { phone: { contains: search } } }
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        items: true
      },
      orderBy: { createdAt: "desc" }
    });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching orders.", error: error.message });
  }
};

// Update Order Status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    let updatedPaymentStatus = paymentStatus || existingOrder.paymentStatus;
    let refundDetails = null;

    // Handle Cancellation: Refund Razorpay payment & restore inventory stock
    if (orderStatus === "CANCELLED" && existingOrder.orderStatus !== "CANCELLED") {
      // 1. Process Automatic Razorpay Refund if order was paid online
      if (existingOrder.paymentStatus === "PAID" && existingOrder.razorpayPaymentId) {
        try {
          refundDetails = await paymentService.refundPayment(existingOrder.razorpayPaymentId, existingOrder.total);
          updatedPaymentStatus = "REFUNDED";
          console.log(`[AUTOMATIC REFUND] Successfully processed refund for Order #${existingOrder.orderNumber}`);
        } catch (refundErr) {
          console.error(`[REFUND FAILED] Could not refund Order #${existingOrder.orderNumber}:`, refundErr.message);
          // Set to REFUND_FAILED if payment gateway rejected
          updatedPaymentStatus = "REFUND_FAILED";
        }
      } else if (existingOrder.paymentStatus === "PAID") {
        updatedPaymentStatus = "REFUNDED";
      }

      // 2. Restore Product Inventory Quantities
      for (const item of existingOrder.items) {
        try {
          const product = await prisma.product.findUnique({ where: { id: item.productId } });
          if (product) {
            const newQty = product.stockQuantity + item.quantity;
            await prisma.product.update({
              where: { id: product.id },
              data: {
                stockQuantity: newQty,
                isOutOfStock: false,
                stockStatus: "IN_STOCK"
              }
            });
            console.log(`[STOCK RESTORED] Restored ${item.quantity} units of '${product.name}' (New stock: ${newQty})`);
          }
        } catch (stockErr) {
          console.error(`[STOCK RESTORE ERROR] Could not restore stock for item ${item.productId}:`, stockErr);
        }
      }
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(orderStatus && { orderStatus }),
        paymentStatus: updatedPaymentStatus
      },
      include: {
        customer: true,
        items: true
      }
    });

    return res.json({
      ...order,
      refundDetails
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating order status.", error: error.message });
  }
};

// Track Order (Public by Phone or Order Number)
const trackOrder = async (req, res) => {
  try {
    const { orderNumber, phone } = req.query;

    if (!orderNumber && !phone) {
      return res.status(400).json({ message: "Order number or phone number is required." });
    }

    const where = {};

    if (orderNumber) {
      where.orderNumber = orderNumber.trim().toUpperCase();
    }

    if (phone) {
      const cleanPhone = phone.trim().replace(/\s+/g, "");
      where.customer = { phone: cleanPhone };
    }

    const orders = await prisma.order.findMany({
      where: {
        ...where,
        orderStatus: { not: "PAYMENT_PENDING" }
      },
      include: {
        customer: true,
        items: true
      },
      orderBy: { createdAt: "desc" }
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found matching your search." });
    }

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Error tracking order.", error: error.message });
  }
};

// Step 1 — Create a Razorpay order before showing payment widget
const createPaymentOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch order from Postgres database
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: id }, { orderNumber: id }]
      },
      include: { customer: true, items: true }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.paymentStatus === "PAID") {
      return res.status(400).json({ message: "This order has already been paid." });
    }

    // Backend recalculates/uses total amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(order.total * 100);

    if (amountInPaise <= 0) {
      return res.status(400).json({ message: "Invalid order total amount." });
    }

    // Call isolated paymentService to create Razorpay Order
    const razorpayOrder = await paymentService.createRazorpayOrder({
      amount: amountInPaise,
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        customerPhone: order.customer.phone
      }
    });

    // Store returned Razorpay order_id on Order row
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id }
    });

    const envKey = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "";
    const cleanKeyId = (envKey && !envKey.includes("your_key") && !envKey.includes("placeholder")) ? envKey : "";

    return res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: cleanKeyId,
      orderNumber: order.orderNumber,
      customer: {
        name: order.customer.name,
        email: order.customer.email || "",
        phone: order.customer.phone
      }
    });
  } catch (error) {
    console.error("Error in createPaymentOrder:", error);
    return res.status(500).json({
      message: error.message || "Failed to create payment order."
    });
  }
};

// Step 2 — Verify payment signature after widget completes
const verifyPaymentOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment verification details (payment_id, order_id, signature) are required." });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: id }, { orderNumber: id }, { razorpayOrderId: razorpay_order_id }]
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found for payment verification." });
    }

    // Verify HMAC signature via paymentService
    const isValid = paymentService.verifyPaymentSignature({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    });

    if (!isValid) {
      console.warn(`[SECURITY ALERT] Invalid payment signature attempt for order #${order.orderNumber}`);
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED" }
      });
      return res.status(400).json({ message: "Payment signature verification failed. Fraud attempt logged." });
    }

    // If valid: update paymentStatus to PAID, orderStatus to CONFIRMED, store razorpayPaymentId
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id
      },
      include: { customer: true, items: true }
    });

    // Automatically decrement product stock for confirmed online paid items
    if (updatedOrder.items && updatedOrder.items.length > 0) {
      for (const item of updatedOrder.items) {
        if (item.productId) {
          try {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (product) {
              const newStock = Math.max(0, product.stockQuantity - item.quantity);
              const isNowOutOfStock = newStock <= 0;
              await prisma.product.update({
                where: { id: product.id },
                data: {
                  stockQuantity: newStock,
                  isOutOfStock: isNowOutOfStock,
                  stockStatus: isNowOutOfStock ? "OUT_OF_STOCK" : "IN_STOCK"
                }
              });
            }
          } catch (e) {
            console.error("Error decrementing stock on payment verification:", e);
          }
        }
      }
    }

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error in verifyPaymentOrder:", error);
    return res.status(500).json({ message: "Error verifying payment.", error: error.message });
  }
};

// Step 3 — Webhook Handler (Defense-in-depth, Idempotent)
const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature) {
      return res.status(400).json({ message: "Missing webhook signature header." });
    }

    const rawPayload = req.rawBody || (typeof req.body === "string" ? req.body : JSON.stringify(req.body));

    const isValid = paymentService.verifyWebhookSignature({
      rawBody: rawPayload,
      signature,
      webhookSecret
    });

    if (!isValid) {
      console.warn("[SECURITY ALERT] Invalid Razorpay Webhook signature.");
      return res.status(400).json({ message: "Invalid webhook signature." });
    }

    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const event = payload.event;

    if (event === "payment.captured") {
      const payment = payload.payload?.payment?.entity;
      if (payment) {
        const razorpayOrderId = payment.order_id;
        const razorpayPaymentId = payment.id;

        if (razorpayOrderId) {
          const order = await prisma.order.findFirst({
            where: { razorpayOrderId }
          });

          if (order && order.paymentStatus !== "PAID") {
            await prisma.order.update({
              where: { id: order.id },
              data: {
                paymentStatus: "PAID",
                orderStatus: "CONFIRMED",
                razorpayPaymentId
              }
            });
            console.log(`[WEBHOOK] Order #${order.orderNumber} updated to PAID via payment.captured webhook.`);
          }
        }
      }
    } else if (event === "payment.failed") {
      const payment = payload.payload?.payment?.entity;
      if (payment) {
        const razorpayOrderId = payment.order_id;

        if (razorpayOrderId) {
          const order = await prisma.order.findFirst({
            where: { razorpayOrderId }
          });

          if (order && order.paymentStatus !== "PAID") {
            await prisma.order.update({
              where: { id: order.id },
              data: { paymentStatus: "FAILED" }
            });
            console.log(`[WEBHOOK] Order #${order.orderNumber} updated to FAILED via payment.failed webhook.`);
          }
        }
      }
    }

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Error processing Razorpay webhook:", error);
    return res.status(500).json({ message: "Internal server error processing webhook." });
  }
};

module.exports = {
  createOrder,
  getAdminOrders,
  updateOrderStatus,
  trackOrder,
  createPaymentOrder,
  verifyPaymentOrder,
  handleRazorpayWebhook
};
