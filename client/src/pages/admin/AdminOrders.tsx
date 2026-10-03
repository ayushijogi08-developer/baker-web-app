import React, { useState, useEffect } from "react";
import { Search, Filter, Clock, CheckCircle, ChefHat, Truck, ShoppingBag, Eye, X, Phone, MapPin, MessageSquare, ChevronDown } from "lucide-react";
import api from "../../services/api";
import { Order, OrderStatus } from "../../types";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/admin?status=${filterStatus}&search=${encodeURIComponent(search)}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, search]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.patch(`/orders/admin/${orderId}/status`, { orderStatus: newStatus });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "PREPARING", label: "Preparing in Kitchen" },
    { value: "READY_FOR_PICKUP", label: "Ready / Out for Delivery" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-heading font-extrabold text-3xl text-[var(--text-primary)]">
              Store Pickup Order Management
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Manage in-site Store Pickup orders. (Home delivery orders are fulfilled directly via Zomato & Swiggy).
            </p>
          </div>
          <Button onClick={fetchOrders} variant="secondary" size="sm">
            Refresh Orders List
          </Button>
        </div>

        {/* Filter & Search Controls */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm text-xs">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Order #, Customer Name or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {["ALL", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "COMPLETED", "CANCELLED"].map((st) => {
              const isSel = filterStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3.5 py-1.5 rounded-full font-extrabold text-[11px] uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
                    isSel
                      ? st === "COMPLETED"
                        ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                        : st === "CANCELLED"
                        ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                        : st === "PREPARING"
                        ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                        : st === "READY_FOR_PICKUP" || st === "CONFIRMED"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-2xs"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)]"
                  }`}
                >
                  {st.replace(/_/g, " ")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider font-bold bg-[var(--bg-secondary)]/50">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Current Live Status</th>
                  <th className="py-3 px-4">Placed Time</th>
                  <th className="py-3 px-4 text-right">View / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-primary)]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[var(--bg-secondary)]/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--accent-primary)] text-sm">
                      #{o.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold">{o.customer?.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{o.customer?.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      {o.orderType === "DELIVERY" ? "🚀 Delivery" : "🏪 Pickup"}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[var(--accent-primary)] text-sm">
                      ₹{o.total}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          o.paymentStatus === "PAID"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                            : o.paymentStatus === "REFUNDED"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                            : o.paymentStatus === "FAILED"
                            ? "bg-rose-500/10 text-rose-600 border border-rose-500/30"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                        }`}>
                          {o.paymentStatus}
                        </span>
                        <p className="text-[10px] text-[var(--text-muted)] font-medium">
                          {o.paymentMethod === "online" ? "Online (Razorpay)" : o.paymentMethod.replace(/_/g, " ")}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {/* Live 1-Click Status Dropdown Selector styled as a Solid Badge */}
                      <div className="relative inline-block">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                          className={`pl-3.5 pr-7 py-1.5 rounded-full font-extrabold text-[11px] shadow-2xs border-0 outline-none cursor-pointer appearance-none uppercase tracking-wider transition-all ${
                            o.orderStatus === "COMPLETED" || o.orderStatus === "DELIVERED"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : o.orderStatus === "CANCELLED"
                              ? "bg-rose-600 hover:bg-rose-700 text-white"
                              : o.orderStatus === "PREPARING"
                              ? "bg-amber-600 hover:bg-amber-700 text-white"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white"
                          }`}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[var(--bg-card)] text-[var(--text-primary)] font-bold py-1">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-white/90 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)]">
                      {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] font-bold flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-[var(--accent-primary)] tracking-wider">Order Invoice</span>
                  <h3 className="font-serif-heading font-extrabold text-2xl text-[var(--text-primary)]">
                    #{selectedOrder.orderNumber}
                  </h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer p-1.5 rounded-xl hover:bg-[var(--bg-hover)]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] space-y-1">
                  <p><b>Customer Name:</b> {selectedOrder.customer?.name}</p>
                  <p><b>Phone:</b> {selectedOrder.customer?.phone}</p>
                  <p><b>Order Type:</b> {selectedOrder.orderType === "DELIVERY" ? "Home Delivery" : "Store Pickup"}</p>
                  {selectedOrder.orderType === "DELIVERY" && <p><b>Address:</b> {selectedOrder.deliveryAddress}</p>}
                  <p><b>Time Slot:</b> {selectedOrder.scheduledTime || "ASAP"}</p>
                  <p><b>Payment Method:</b> {selectedOrder.paymentMethod === "online" ? "Online (Razorpay Gateway)" : selectedOrder.paymentMethod}</p>
                  <p>
                    <b>Payment Status:</b>{" "}
                    <span className={`font-bold ${
                      selectedOrder.paymentStatus === "PAID" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                    }`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                  {selectedOrder.razorpayPaymentId && (
                    <p className="font-mono text-[11px] text-[var(--text-secondary)] pt-1 border-t border-[var(--border-color)]/60">
                      <b>Razorpay Payment ID:</b> {selectedOrder.razorpayPaymentId}
                    </p>
                  )}
                  {selectedOrder.razorpayOrderId && (
                    <p className="font-mono text-[11px] text-[var(--text-secondary)]">
                      <b>Razorpay Order ID:</b> {selectedOrder.razorpayOrderId}
                    </p>
                  )}
                </div>

                {/* Elegant High-Contrast Custom Cake Notes Box */}
                {selectedOrder.notes && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[var(--text-primary)] flex items-start gap-3 shadow-2xs">
                    <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold uppercase tracking-wider text-[10px] text-amber-700 dark:text-amber-400 block mb-0.5">
                        Custom Cake Instructions / Notes
                      </span>
                      <p className="font-extrabold text-sm text-[var(--text-primary)]">{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}

                <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] space-y-2">
                  <p className="font-extrabold text-xs uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1.5">Items Breakdown</p>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-1 border-b border-[var(--border-color)]/40 font-medium">
                      <span>{item.productNameSnapshot} ({item.sizeLabelSnapshot}) x {item.quantity}</span>
                      <span className="font-bold text-[var(--text-primary)]">₹{item.lineTotal}</span>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-[var(--border-color)] space-y-1.5 text-[var(--text-secondary)]">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-[var(--text-primary)]">₹{selectedOrder.subtotal}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount:</span>
                        <span>-₹{selectedOrder.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Fee (inc. distance):</span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {selectedOrder.deliveryFee === 0 ? "FREE" : `₹${selectedOrder.deliveryFee}`}
                      </span>
                    </div>
                    <div className="pt-2.5 border-t border-[var(--border-color)] flex justify-between font-extrabold text-base text-[var(--accent-primary)]">
                      <span>Total Amount Payable</span>
                      <span className="font-serif-heading font-extrabold text-xl text-[var(--accent-primary)]">
                        ₹{selectedOrder.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button onClick={() => setSelectedOrder(null)} variant="primary" size="md">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
