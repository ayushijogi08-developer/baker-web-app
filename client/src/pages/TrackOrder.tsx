import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, CheckCircle, ChefHat, Truck, ShoppingBag, AlertCircle, RefreshCw, History, Phone, Cake, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { Order, OrderStatus } from "../types";
import { Button } from "../components/ui/Button";

interface StoredOrder {
  orderNumber: string;
  customerPhone: string;
  customerName: string;
  total: number;
  date: string;
}

export const TrackOrder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialOrderNum = searchParams.get("orderNumber") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [phone, setPhone] = useState<string>(initialPhone);
  const [orderNumber, setOrderNumber] = useState<string>(initialOrderNum);
  const [showOrderNumInput, setShowOrderNumInput] = useState<boolean>(Boolean(initialOrderNum));
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [recentOrders, setRecentOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("thb_recent_orders");
      if (saved) {
        setRecentOrders(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Error reading recent orders:", err);
    }
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanDigits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(cleanDigits);
  };

  const handleTrack = async (e?: React.FormEvent, customOrderNum?: string, customPhone?: string) => {
    if (e) e.preventDefault();
    const queryOrderNum = customOrderNum !== undefined ? customOrderNum : orderNumber;
    const rawPhone = customPhone !== undefined ? customPhone : phone;
    const queryPhone = rawPhone.replace(/\D/g, "").slice(0, 10);

    if (!queryPhone.trim() && !queryOrderNum.trim()) {
      setError("Please enter your 10-digit Phone Number to track your bakery orders.");
      return;
    }

    if (queryPhone.trim() && queryPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let queryUrl = "/orders/track?";
      if (queryPhone.trim()) queryUrl += `phone=${encodeURIComponent(queryPhone.trim())}&`;
      if (queryOrderNum.trim()) queryUrl += `orderNumber=${encodeURIComponent(queryOrderNum.trim())}`;

      const res = await api.get(queryUrl);

      if (Array.isArray(res.data)) {
        const fetchedOrders: Order[] = res.data;
        setOrderList(fetchedOrders);
        const active = fetchedOrders.filter(
          (o) => o.orderStatus !== "COMPLETED" && o.orderStatus !== "CANCELLED"
        );
        const past = fetchedOrders.filter(
          (o) => o.orderStatus === "COMPLETED" || o.orderStatus === "CANCELLED"
        );
        if (active.length > 0) {
          setSelectedOrder(active[0]);
        } else if (past.length > 0) {
          setSelectedOrder(past[0]);
        } else {
          setSelectedOrder(fetchedOrders[0] || null);
        }
      } else {
        setOrderList([res.data]);
        setSelectedOrder(res.data);
      }
    } catch (err: any) {
      setOrderList([]);
      setSelectedOrder(null);
      setError(err.response?.data?.message || "No orders found for this phone number. Please check your phone number.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPhone || initialOrderNum) {
      handleTrack(undefined, initialOrderNum, initialPhone);
    }
  }, [initialPhone, initialOrderNum]);

  // Order Status Stepper logic
  const steps: { key: OrderStatus; label: string; icon: any }[] = [
    { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
    { key: "PREPARING", label: "Preparing in Kitchen", icon: ChefHat },
    { key: "READY_FOR_PICKUP", label: "Ready / Out for Delivery", icon: Truck },
    { key: "COMPLETED", label: "Completed", icon: ShoppingBag }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case "CONFIRMED":
        return 0;
      case "PREPARING":
        return 1;
      case "READY_FOR_PICKUP":
      case "OUT_FOR_DELIVERY":
        return 2;
      case "COMPLETED":
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = selectedOrder ? getStepIndex(selectedOrder.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Compact Editorial Header */}
      <div className="text-center max-w-xl mx-auto space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--accent-primary)]">
          Instant Order Status
        </span>
        <h1 className="font-serif-heading font-extrabold text-xl sm:text-2xl text-[var(--text-primary)]">
          Track Store Pickup Order
        </h1>
        <p className="text-[11px] sm:text-xs text-[var(--text-secondary)]">
          Enter your <b>10-digit Phone Number</b> to check live baking & pickup readiness for your store pickup order.
        </p>
      </div>

      {/* Recent Orders Section (For User Convenience) */}
      {recentOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-3xl shadow-sm max-w-xl mx-auto space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            <History className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>Your Recent Orders</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {recentOrders.slice(0, 4).map((ro) => (
              <motion.button
                key={ro.orderNumber}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setPhone(ro.customerPhone);
                  setOrderNumber(ro.orderNumber);
                  handleTrack(undefined, ro.orderNumber, ro.customerPhone);
                }}
                className="px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-left shrink-0 transition-all cursor-pointer"
              >
                <div className="font-mono font-bold text-xs text-[var(--accent-primary)]">#{ro.orderNumber}</div>
                <div className="text-[10px] text-[var(--text-secondary)]">{ro.customerName} • ₹{ro.total}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Lookup Form */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-sm max-w-xl mx-auto space-y-4">
        <form onSubmit={handleTrack} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[var(--text-primary)] mb-1">
              Customer Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]{10}"
                placeholder="Enter 10-digit phone number (e.g. 9765013112)"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono font-bold focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          {showOrderNumInput && (
            <div>
              <label className="block font-bold text-[var(--text-primary)] mb-1">
                Specific Order Number (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. THB-8492"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono font-bold uppercase focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowOrderNumInput(!showOrderNumInput)}
              className="text-[11px] text-[var(--accent-primary)] font-bold hover:underline"
            >
              {showOrderNumInput ? "Hide Order ID filter" : "+ Filter by Specific Order ID"}
            </button>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1" />
            ) : (
              <Search className="w-4 h-4 mr-1" />
            )}
            {loading ? "Searching Database..." : "Track My Orders"}
          </Button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </div>

      {/* Tasteful Bakery Loading Indicator */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center space-y-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl max-w-xl mx-auto"
        >
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-amber-500/20"
            />
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Cake className="w-8 h-8 text-[var(--accent-primary)]" />
            </motion.div>
          </div>
          <p className="text-xs font-bold text-[var(--text-secondary)]">
            Checking live bakery oven & delivery status...
          </p>
        </motion.div>
      )}

      {/* All Orders View Container */}
      {!loading && orderList.length > 0 && (
        <div className="space-y-6">
          {/* Top Order Switcher Bar */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Your Bakery Orders ({orderList.length})
              </span>
              {orderList.filter((o) => o.orderStatus !== "COMPLETED" && o.orderStatus !== "CANCELLED").length > 0 && (
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {orderList.filter((o) => o.orderStatus !== "COMPLETED" && o.orderStatus !== "CANCELLED").length} Active Order in Progress
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {orderList.map((ord) => {
                const isSel = selectedOrder?.id === ord.id;
                const isComp = ord.orderStatus === "COMPLETED" || ord.orderStatus === "DELIVERED";
                const isCanc = ord.orderStatus === "CANCELLED";
                const isAct = !isComp && !isCanc;

                return (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => setSelectedOrder(ord)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                      isSel
                        ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-sm ring-2 ring-[var(--accent-primary)]/20"
                        : isAct
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
                        : isComp
                        ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/20"
                        : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 hover:bg-rose-500/20"
                    }`}
                  >
                    <span>#{ord.orderNumber}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase inline-flex items-center gap-1 ${
                        isSel
                          ? "bg-white/20 text-white"
                          : isAct
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : isComp
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "bg-rose-600 text-white shadow-2xs"
                      }`}
                    >
                      {isAct ? "ACTIVE" : isComp ? "✓ COMPLETED" : "✕ CANCELLED"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Order Status Detail View */}
          {selectedOrder && (
            <motion.div
              key={selectedOrder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-md space-y-8"
            >
              {/* Order Header Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border-color)] gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    ● Live Database Record
                  </span>
                  <h2 className="font-serif-heading font-extrabold text-2xl text-[var(--text-primary)] mt-1">
                    Order #{selectedOrder.orderNumber}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[var(--text-muted)] block">Total Payable</span>
                  <span className="font-serif-heading font-extrabold text-2xl text-[var(--accent-primary)]">
                    ₹{selectedOrder.total}
                  </span>
                </div>
              </div>

              {/* Order Progress / Cancelled State */}
              {selectedOrder.orderStatus === "CANCELLED" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-rose-500/10 border-2 border-rose-500/30 p-6 rounded-3xl text-center space-y-3 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-heading font-extrabold text-xl text-rose-600 dark:text-rose-400">
                    Order #{selectedOrder.orderNumber} Has Been Cancelled
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed font-medium">
                    This bakery order was cancelled by store management. If payment was deducted online, your refund will be processed automatically back to your original payment method.
                  </p>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-2xs">
                      <XCircle className="w-3.5 h-3.5" /> Status: Cancelled
                    </span>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                    Current Baking & Delivery Progress
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {steps.map((stepObj, idx) => {
                      const Icon = stepObj.icon;
                      const isOrderCompleted = selectedOrder.orderStatus === "COMPLETED";
                      const isCompleted = isOrderCompleted || idx <= currentStepIdx;
                      const isCurrent = !isOrderCompleted && idx === currentStepIdx;

                      return (
                        <motion.div
                          key={stepObj.key}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.3 }}
                          className={`p-4 rounded-2xl border text-center transition-all ${
                            isCurrent
                              ? "bg-[var(--accent-light)] border-[var(--accent-primary)] font-bold shadow-sm"
                              : isCompleted
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold"
                              : "bg-[var(--bg-secondary)] border-[var(--border-color)] opacity-50"
                          }`}
                        >
                          <motion.div
                            animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                            transition={isCurrent ? { duration: 1.5, repeat: Infinity } : {}}
                            className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm ${
                              isCurrent
                                ? "bg-[var(--accent-primary)] text-white"
                                : isCompleted
                                ? "bg-emerald-600 text-white"
                                : "bg-[var(--bg-card)] text-[var(--text-muted)]"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </motion.div>
                          <p className="text-xs font-bold leading-snug">{stepObj.label}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Customer & Item Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-color)] text-xs">
                {/* Left: Customer Info */}
                <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] space-y-2">
                  <h4 className="font-bold text-sm text-[var(--text-primary)] pb-1 border-b border-[var(--border-color)]">
                    Delivery Details
                  </h4>
                  <p><b>Customer:</b> {selectedOrder.customer?.name} ({selectedOrder.customer?.phone})</p>
                  <p><b>Order Type:</b> {selectedOrder.orderType === "DELIVERY" ? "🚀 Home Delivery" : "🏪 Store Pickup"}</p>
                  {selectedOrder.orderType === "DELIVERY" && <p><b>Address:</b> {selectedOrder.deliveryAddress}</p>}
                  <p><b>Scheduled Slot:</b> {selectedOrder.scheduledTime || "ASAP"}</p>
                  <p>
                    <b>Payment Method:</b> {selectedOrder.paymentMethod === "online" ? "Online (Razorpay)" : selectedOrder.paymentMethod.replace(/_/g, " ")}
                  </p>
                  <p className="flex items-center gap-2 pt-1 border-t border-[var(--border-color)]/60">
                    <b>Payment Status:</b>{" "}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      selectedOrder.paymentStatus === "PAID"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : selectedOrder.paymentStatus === "FAILED"
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                    }`}>
                      {selectedOrder.paymentStatus === "PAID" ? "Paid Online" : selectedOrder.paymentStatus}
                    </span>
                  </p>
                </div>

                {/* Right: Items List */}
                <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] space-y-2">
                  <h4 className="font-bold text-sm text-[var(--text-primary)] pb-1 border-b border-[var(--border-color)]">
                    Items Ordered
                  </h4>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-1 border-b border-[var(--border-color)]/50">
                      <span>
                        {item.productNameSnapshot} ({item.sizeLabelSnapshot}) x {item.quantity}
                      </span>
                      <span className="font-bold text-[var(--text-primary)]">
                        ₹{item.lineTotal}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-extrabold text-sm text-[var(--accent-primary)]">
                    <span>Grand Total</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* All Orders Summary List */}
          {orderList.length > 1 && (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[var(--accent-primary)]" />
                  <h3 className="font-serif-heading font-extrabold text-base sm:text-lg text-[var(--text-primary)]">
                    All Orders for {phone || selectedOrder?.customer?.phone} ({orderList.length})
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[var(--text-muted)] hidden sm:inline">
                  Click any order to view details above
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {orderList.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  const isCompleted = ord.orderStatus === "COMPLETED" || ord.orderStatus === "DELIVERED";
                  const isCancelled = ord.orderStatus === "CANCELLED";
                  const isActive = !isCompleted && !isCancelled;

                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-[var(--accent-light)] border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/20 shadow-xs"
                          : isActive
                          ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
                          : isCompleted
                          ? "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40"
                          : "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40"
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-extrabold text-xs text-[var(--text-primary)]">
                            #{ord.orderNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase inline-flex items-center gap-1 ${
                              isActive
                                ? "bg-emerald-600 text-white shadow-2xs"
                                : isCompleted
                                ? "bg-blue-600 text-white shadow-2xs"
                                : "bg-rose-600 text-white shadow-2xs"
                            }`}
                          >
                            {isActive ? `🟢 ACTIVE (${ord.orderStatus.replace(/_/g, " ")})` : isCompleted ? "✓ COMPLETED" : "✕ CANCELLED"}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-extrabold text-[var(--accent-primary)]">
                              • Currently Displayed Above
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] font-medium truncate">
                          {ord.items.map((i) => `${i.productNameSnapshot} x${i.quantity}`).join(", ")}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          Placed on {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border-color)]/60">
                        <span className="font-serif-heading font-extrabold text-sm text-[var(--accent-primary)]">
                          ₹{ord.total}
                        </span>
                        <button
                          type="button"
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            isSelected
                              ? "bg-[var(--accent-primary)] text-white"
                              : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
                          }`}
                        >
                          {isSelected ? "Viewing" : "View Details"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
