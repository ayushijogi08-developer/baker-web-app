# 🎂 The Hidden Bakers — Full-Stack Bakery Platform

A modern, production-quality full-stack website and ordering platform for **The Hidden Bakers**, located in Akola, Maharashtra. Built with a **Node.js Express + Prisma ORM** database backend and a **React + Vite + TypeScript** frontend with a complete **Admin Management Dashboard** and **Live DB Order Tracker**.

---

## 🏬 Store Information

* **Business Name:** The Hidden Bakers
* **Address:** Infront of LRT College, Necklace Road, New Radhakisan Plots, Akola, Maharashtra 444001
* **Phone:** 097650 13112 (`+91 97650 13112`)
* **WhatsApp Order Line:** `919765013112`

---

## ✨ Features & Architecture

* **Relational Database Backend (Prisma ORM):**
  - Manages `User`, `Category`, `Product`, `ProductImage`, `ProductSize`, `Customer`, `Order`, `OrderItem`, `Coupon`, and `StoreSettings`.
  - Re-validates product prices and stock server-side before order creation (never trusts client price input).
* **Live Order Tracking (`/track-order`):**
  - Scoped public lookup requiring **Order Number** (e.g. `THB-8492`) and **Phone Number**.
  - Displays real-time progress timeline (`CONFIRMED` → `PREPARING` → `READY_FOR_PICKUP` → `COMPLETED`).
* **Admin Management Portal (`/admin`):**
  - Protected by JWT Bearer token authentication and role check.
  - **Overview Dashboard:** Total sales revenue, active order counts, and out-of-stock alerts.
  - **Product & Inventory Manager:** Add/edit products, sizes, ingredients, photos, and 1-click **In Stock / Out of Stock** toggle switch.
  - **Order Manager:** 1-click status dropdown updates that instantly reflect on the customer order tracker.
  - **Store Settings Editor:** Update bakery phone, address, WhatsApp number, and delivery fees.
* **Light & Dark Theme System:**
  - Light (Cream `#FAF7F2` / Chocolate `#2A1810`) and Dark (Espresso `#140E0C` / Amber `#E58E26`) tokens.
* **Instant WhatsApp Checkout:**
  - Saves real order to database and opens pre-filled WhatsApp invoice to `919765013112`.

---

## 🔐 Seed Admin Credentials

To log into the Admin Dashboard at `http://localhost:5174/admin/login`:

* **Email:** `admin@thehiddenbakers.com`
* **Password:** `admin123`

---

## 🛠️ Technology Stack

* **Backend (`server/`):** Node.js, Express.js, Prisma ORM, JWT, BcryptJS, Multer
* **Frontend (`client/`):** React 19, Vite, TypeScript, Tailwind CSS v4, Lucide Icons, Axios, React Router

---

## 📂 Project Directory Structure

```
hidden_beaker/
├── client/                     # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/         # AdminLayout, Header, Footer, CartDrawer, CheckoutModal
│   │   ├── context/            # AuthContext (JWT), CartContext, ThemeContext
│   │   ├── pages/
│   │   │   ├── admin/          # AdminDashboard, AdminProducts, AdminOrders, AdminSettings, AdminLogin
│   │   │   ├── Home.tsx, Menu.tsx, ProductDetail.tsx, TrackOrder.tsx, About.tsx, Contact.tsx
│   │   ├── services/           # Axios API Client
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
│
├── server/                     # Node.js + Express + Prisma Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Relational models
│   │   ├── dev.db              # SQLite Database file
│   │   └── seed.js             # Initial database seed script
│   ├── src/
│   │   ├── controllers/        # auth, product, category, order, settings, coupon
│   │   ├── middleware/         # authMiddleware, uploadMiddleware
│   │   ├── routes/             # API routes
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## 🚀 How to Run Locally

### 1. Start the Backend API Server
```bash
cd server
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
node server.js
```
The server will run on `http://localhost:5000`.

### 2. Start the Frontend Development Client
```bash
cd client
npm install
npm run dev
```
The client will run on `http://localhost:5174` (or `http://localhost:5173`).

---

## 📡 API Endpoints Reference

* `POST /api/auth/login` — Admin login returning JWT
* `GET /api/products` — Public product catalog
* `GET /api/products/:slug` — Product details
* `POST /api/orders` — Guest order creation (validates stock & prices server-side)
* `GET /api/orders/track?orderNumber=...&phone=...` — Live DB order tracker
* `GET /api/orders/admin` — Admin order list (JWT protected)
* `PATCH /api/orders/admin/:id/status` — Update live order progress
* `POST /api/orders/:id/create-payment` — Create Razorpay payment order (server-calculated total)
* `POST /api/orders/:id/verify-payment` — HMAC-SHA256 signature verification of payment
* `POST /api/webhooks/razorpay` — Webhook handler (`payment.captured`, `payment.failed`)
* `GET /api/settings` — Store settings
* `PUT /api/settings/admin` — Update store settings (JWT protected)

---

## 💳 Razorpay Payment Gateway Integration

The Hidden Bakers supports real-time online payments (UPI, Debit & Credit Cards, Netbanking) via **Razorpay** alongside non-gateway options (Cash / Pay-on-Delivery / Pay-at-Store).

### Security & Architecture Principles
* **Server-Calculated Amounts**: The backend recalculates order totals from database prices; cart amounts sent from frontend are never trusted.
* **Cryptographic Verification**: Payment status is updated only after server-side HMAC-SHA256 signature verification (`verify-payment`) or signed webhooks (`/api/webhooks/razorpay`).
* **Isolated Service Module**: Payment logic is encapsulated in `server/src/services/paymentService.js`.

### Environment Configuration

#### Backend (`server/.env`)
```env
RAZORPAY_KEY_ID="rzp_test_xxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
```

#### Frontend (`client/.env`)
```env
VITE_RAZORPAY_KEY_ID="rzp_test_xxxxxxx"
```

### Switching from Test Mode to Production (Going Live)
1. Complete business KYC verification in the [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Generate Live API Keys from Razorpay Dashboard settings.
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in production `.env` (and `VITE_RAZORPAY_KEY_ID` in production client `.env`).
4. Register your production webhook URL (`https://yourdomain.com/api/webhooks/razorpay`) in the Razorpay Webhooks dashboard for events `payment.captured` and `payment.failed`.

