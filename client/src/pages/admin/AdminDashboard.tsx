import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, DollarSign, Clock, AlertTriangle, ArrowRight, CheckCircle, RefreshCw } from "lucide-react";
import api from "../../services/api";
import { Order, Product } from "../../types";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get("/orders/admin"),
        api.get("/products")
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === "CONFIRMED" || o.orderStatus === "PREPARING");
  const outOfStockProducts = products.filter((p) => p.stockStatus === "OUT_OF_STOCK");

  const handleRestock = async (productId: string) => {
    try {
      await api.patch(`/products/admin/${productId}/stock`, { stockStatus: "IN_STOCK" });
      fetchData();
    } catch (err) {
      console.error("Failed to restock product:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-heading font-extrabold text-3xl text-[var(--text-primary)]">
              Bakery Performance Overview
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Live metrics powered by your PostgreSQL database.
            </p>
          </div>
          <Button onClick={fetchData} variant="secondary" size="sm">
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh Data
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-emerald-600">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Sales</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="font-serif-heading font-extrabold text-3xl text-[var(--text-primary)]">
              ₹{totalRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">From {orders.length} completed & active orders</p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[var(--accent-primary)]">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Orders</span>
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-light)] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <p className="font-serif-heading font-extrabold text-3xl text-[var(--text-primary)]">
              {orders.length}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Guest & repeat customer orders</p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Pending Baking</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="font-serif-heading font-extrabold text-3xl text-amber-600 dark:text-amber-400">
              {pendingOrders.length}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Need kitchen prep / dispatch</p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-rose-500">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Out of Stock</span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <p className="font-serif-heading font-extrabold text-3xl text-rose-600 dark:text-rose-400">
              {outOfStockProducts.length}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Items currently disabled for checkout</p>
          </div>
        </div>

        {/* Out of Stock Alert Section */}
        {outOfStockProducts.length > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Out of Stock Inventory Alert ({outOfStockProducts.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {outOfStockProducts.map((p) => (
                <div key={p.id} className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-[var(--text-primary)]">{p.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">₹{p.price}</p>
                  </div>
                  <button
                    onClick={() => handleRestock(p.id)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                  >
                    Restock
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders Section */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading font-bold text-xl text-[var(--text-primary)]">
              Recent Store Orders
            </h3>
            <Link to="/admin/orders" className="text-xs font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1">
              View All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                  <th className="py-3 px-2">Order #</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Total</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Placed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-primary)]">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-[var(--bg-secondary)]">
                    <td className="py-3 px-2 font-mono font-bold text-[var(--accent-primary)]">
                      #{o.orderNumber}
                    </td>
                    <td className="py-3 px-2">
                      <p className="font-bold">{o.customer?.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{o.customer?.phone}</p>
                    </td>
                    <td className="py-3 px-2 font-semibold">
                      {o.orderType === "DELIVERY" ? "🚀 Delivery" : "🏪 Pickup"}
                    </td>
                    <td className="py-3 px-2 font-extrabold text-[var(--accent-primary)]">
                      ₹{o.total}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1 ${
                          o.orderStatus === "COMPLETED" || o.orderStatus === "DELIVERED"
                            ? "bg-blue-600 text-white shadow-2xs"
                            : o.orderStatus === "CANCELLED"
                            ? "bg-rose-600 text-white shadow-2xs"
                            : "bg-emerald-600 text-white shadow-2xs"
                        }`}
                      >
                        {o.orderStatus === "COMPLETED" || o.orderStatus === "DELIVERED"
                          ? "✓ COMPLETED"
                          : o.orderStatus === "CANCELLED"
                          ? "✕ CANCELLED"
                          : `🟢 ${o.orderStatus.replace(/_/g, " ")}`}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-[var(--text-muted)]">
                      {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
