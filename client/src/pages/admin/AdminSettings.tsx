import React, { useState, useEffect } from "react";
import { Save, Store, Phone, MapPin, CheckCircle, Truck, AlertCircle, Ticket, Plus, Trash2, Tag, ToggleLeft, ToggleRight, RefreshCw, DollarSign, Percent, Clock } from "lucide-react";
import api from "../../services/api";
import { StoreSettings } from "../../types";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Button } from "../../components/ui/Button";
import { useCart } from "../../context/CartContext";

interface CouponItem {
  id: string;
  code: string;
  type: "PERCENT" | "FLAT";
  value: number;
  minimumOrder: number;
  active: boolean;
  createdAt: string;
}

export const AdminSettings: React.FC = () => {
  const { refreshSettings } = useCart();
  const [activeTab, setActiveTab] = useState<"settings" | "coupons">("settings");
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Coupon Management State
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [couponLoading, setCouponLoading] = useState<boolean>(false);
  const [newCouponCode, setNewCouponCode] = useState<string>("");
  const [newCouponType, setNewCouponType] = useState<"PERCENT" | "FLAT">("PERCENT");
  const [newCouponValue, setNewCouponValue] = useState<string>("");
  const [newCouponMinOrder, setNewCouponMinOrder] = useState<string>("0");
  const [creatingCoupon, setCreatingCoupon] = useState<boolean>(false);
  const [couponMsg, setCouponMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCoupons = async () => {
    setCouponLoading(true);
    try {
      const res = await api.get("/coupons/admin");
      setCoupons(res.data);
    } catch (err) {
      console.error("Error loading coupons:", err);
    } finally {
      setCouponLoading(false);
    }
  };

  useEffect(() => {
    api.get("/settings")
      .then((res) => {
        setSettings(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading settings:", err));

    fetchCoupons();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return;
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setErrorMessage("");

    const parseNum = (val: any, fallback: number) => {
      const n = parseFloat(val);
      return isNaN(n) ? fallback : n;
    };

    try {
      const payload = {
        ...settings,
        deliveryFee: parseNum(settings.deliveryFee, 40),
        freeDeliveryThreshold: parseNum(settings.freeDeliveryThreshold, 500),
        minOrderAmount: parseNum(settings.minOrderAmount, 100),
        maxDeliveryDistanceKm: parseNum(settings.maxDeliveryDistanceKm, 30),
        baseIncludedKm: parseNum(settings.baseIncludedKm, 5),
        extraKmFee: parseNum(settings.extraKmFee, 10)
      };

      const res = await api.put("/settings/admin", payload);
      setSettings(res.data);
      setSavedSuccess(true);
      await refreshSettings();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSavedSuccess(false), 5000);
    } catch (err: any) {
      console.error("Error updating settings:", err);
      setErrorMessage(err.response?.data?.message || err.response?.data?.error || "Error saving settings.");
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponValue.trim()) return;

    setCreatingCoupon(true);
    setCouponMsg(null);

    try {
      await api.post("/coupons/admin", {
        code: newCouponCode.trim().toUpperCase(),
        type: newCouponType,
        value: parseFloat(newCouponValue),
        minimumOrder: parseFloat(newCouponMinOrder) || 0
      });

      setCouponMsg({ type: "success", text: `Promo code "${newCouponCode.toUpperCase()}" created successfully!` });
      setNewCouponCode("");
      setNewCouponValue("");
      setNewCouponMinOrder("0");
      fetchCoupons();
    } catch (err: any) {
      setCouponMsg({ type: "error", text: err.response?.data?.message || "Failed to create promo code." });
    } finally {
      setCreatingCoupon(false);
    }
  };

  const handleToggleCoupon = async (id: string, currentActive: boolean) => {
    try {
      await api.put(`/coupons/admin/${id}/toggle`, { active: !currentActive });
      fetchCoupons();
    } catch (err: any) {
      console.error("Error toggling coupon status", err);
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete promo code "${code}"?`)) return;
    try {
      await api.delete(`/coupons/admin/${id}`);
      fetchCoupons();
    } catch (err: any) {
      console.error("Error deleting coupon", err);
    }
  };

  if (loading || !settings) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-xs text-[var(--text-muted)]">Loading store configuration...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Top Header & Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <h1 className="font-serif-heading font-extrabold text-3xl text-[var(--text-primary)]">
              Store Administration
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Manage store settings, distance delivery pricing, and promo coupon offers.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1 rounded-2xl border border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-[var(--accent-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Store className="w-4 h-4" /> Store Settings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("coupons")}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "coupons"
                  ? "bg-[var(--accent-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Ticket className="w-4 h-4" /> Coupons & Offers
              {coupons.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-black">
                  {coupons.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: STORE & DELIVERY SETTINGS */}
        {activeTab === "settings" && (
          <>
            {savedSuccess && (
              <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-2xl text-emerald-700 dark:text-emerald-300 font-extrabold text-sm flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200 shadow-md">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p>🎉 Store & Delivery Settings Updated Successfully!</p>
                  <p className="text-xs font-normal text-emerald-600 dark:text-emerald-400 mt-0.5">New base fees, free distance limits, and per-KM rates are now live on checkout.</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-rose-500/10 border-2 border-rose-500/50 rounded-2xl text-rose-700 dark:text-rose-300 font-bold text-sm flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <div>{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* STORE INFO CARD */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl space-y-4 shadow-xs">
                <h2 className="font-serif-heading font-bold text-lg text-[var(--text-primary)] flex items-center gap-2">
                  <Store className="w-5 h-5 text-[var(--accent-primary)]" /> General Store Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">Store Name *</label>
                    <input
                      type="text"
                      name="storeName"
                      value={settings.storeName}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">Tagline</label>
                    <input
                      type="text"
                      name="tagline"
                      value={settings.tagline}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> Bakery Address (Akola) *
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" /> Phone Number *
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={settings.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">WhatsApp Number (for Orders) *</label>
                    <input
                      type="text"
                      name="whatsappNumber"
                      value={settings.whatsappNumber}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                </div>
              </div>

              {/* DISTANCE & DELIVERY RATES */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl space-y-4 shadow-xs">
                <h2 className="font-serif-heading font-bold text-lg text-[var(--text-primary)] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[var(--accent-primary)]" /> Distance & Delivery Pricing Controls
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">Base Delivery Fee (₹)</label>
                    <input
                      type="number"
                      name="deliveryFee"
                      value={settings.deliveryFee}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">Free Delivery Min. Order (₹)</label>
                    <input
                      type="number"
                      name="freeDeliveryThreshold"
                      value={settings.freeDeliveryThreshold}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">Minimum Order Amount (₹)</label>
                    <input
                      type="number"
                      name="minOrderAmount"
                      value={settings.minOrderAmount}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[var(--border-color)]">
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">Max Delivery Radius (km)</label>
                    <input
                      type="number"
                      name="maxDeliveryDistanceKm"
                      value={settings.maxDeliveryDistanceKm}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">Base Included Radius (km)</label>
                    <input
                      type="number"
                      name="baseIncludedKm"
                      value={settings.baseIncludedKm}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">Extra Fee per Exceeded KM (₹)</label>
                    <input
                      type="number"
                      name="extraKmFee"
                      value={settings.extraKmFee}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                </div>
              </div>

              {/* TIMINGS & MANUAL OVERRIDE */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl space-y-4 shadow-xs">
                <h2 className="font-serif-heading font-bold text-lg text-[var(--text-primary)] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" /> Store Operating Hours
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">Opening Time</label>
                    <input
                      type="time"
                      name="openingTime"
                      value={settings.openingTime || "09:00"}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">Closing Time</label>
                    <input
                      type="time"
                      name="closingTime"
                      value={settings.closingTime || "22:00"}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">Manual Override Status</label>
                    <select
                      name="isStoreOpenManualOverride"
                      value={
                        settings.isStoreOpenManualOverride === true
                          ? "force_open"
                          : settings.isStoreOpenManualOverride === false
                          ? "force_closed"
                          : "auto"
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettings({
                          ...settings,
                          isStoreOpenManualOverride: val === "force_open" ? true : val === "force_closed" ? false : null
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                    >
                      <option value="auto">Automatic (By Schedule Window)</option>
                      <option value="force_open">Force Open Store 🟢</option>
                      <option value="force_closed">Force Close Store 🔴</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">Custom Closed Notice</label>
                  <input
                    type="text"
                    name="storeClosedNotice"
                    value={settings.storeClosedNotice || "Store is currently closed for delivery & orders. We open at 09:00 AM."}
                    onChange={handleChange}
                    placeholder="Notice banner displayed when closed"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                {savedSuccess ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Settings updated successfully!
                  </span>
                ) : <div />}

                <Button type="submit" variant="primary" size="lg">
                  <Save className="w-4 h-4 mr-1" /> Save Settings
                </Button>
              </div>
            </form>
          </>
        )}

        {/* TAB 2: COUPON CREATOR & PROMO CODE MANAGEMENT */}
        {activeTab === "coupons" && (
          <div className="space-y-6 text-xs">
            {/* COUPON CREATOR CARD */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div>
                  <h2 className="font-serif-heading font-extrabold text-lg text-[var(--text-primary)] flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-[var(--accent-primary)]" /> Create New Promo Code / Coupon
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Create discount coupons that customers can apply in the cart drawer & checkout.
                  </p>
                </div>
              </div>

              {couponMsg && (
                <div className={`p-3.5 rounded-2xl font-bold flex items-center gap-2 ${
                  couponMsg.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400"
                }`}>
                  {couponMsg.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{couponMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">Coupon Code *</label>
                  <div className="relative">
                    <Tag className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. HIDDEN10"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-extrabold tracking-wider focus:outline-none focus:border-[var(--accent-primary)] uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">Discount Type *</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as "PERCENT" | "FLAT")}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer"
                  >
                    <option value="PERCENT">% Percentage Discount</option>
                    <option value="FLAT">₹ Flat Amount Off</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    {newCouponType === "PERCENT" ? "Discount Percentage (%) *" : "Flat Discount (₹) *"}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(e.target.value)}
                    placeholder={newCouponType === "PERCENT" ? "e.g. 10 (for 10% off)" : "e.g. 100 (for ₹100 off)"}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">Min. Order Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(e.target.value)}
                    placeholder="e.g. 300 (0 for no min)"
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-end pt-2 border-t border-[var(--border-color)]">
                  <Button type="submit" variant="primary" size="md" disabled={creatingCoupon}>
                    <Plus className="w-4 h-4 mr-1" /> {creatingCoupon ? "Creating..." : "Save & Activate Coupon"}
                  </Button>
                </div>
              </form>
            </div>

            {/* ACTIVE & EXPIRED COUPONS LIST */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div>
                  <h2 className="font-serif-heading font-extrabold text-lg text-[var(--text-primary)] flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[var(--accent-primary)]" /> Active & Managed Promo Codes
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Toggle activation status or remove expired promotion coupons.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchCoupons}
                  className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  title="Refresh Coupons"
                >
                  <RefreshCw className={`w-4 h-4 ${couponLoading ? "animate-spin text-[var(--accent-primary)]" : ""}`} />
                </button>
              </div>

              {coupons.length === 0 ? (
                <div className="p-8 text-center bg-[var(--bg-secondary)]/50 rounded-2xl border border-[var(--border-color)] space-y-2">
                  <Ticket className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
                  <p className="font-bold text-[var(--text-secondary)]">No promo codes created yet.</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Use the form above to create your first store promo coupon!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-color)] text-[11px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
                        <th className="pb-3 px-2">Coupon Code</th>
                        <th className="pb-3 px-2">Discount</th>
                        <th className="pb-3 px-2">Min. Order</th>
                        <th className="pb-3 px-2">Status</th>
                        <th className="pb-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {coupons.map((c) => (
                        <tr key={c.id} className="group hover:bg-[var(--bg-secondary)]/40 transition-colors">
                          <td className="py-3.5 px-2">
                            <span className="font-extrabold text-[var(--accent-primary)] text-sm tracking-wider font-mono bg-[var(--accent-primary)]/10 px-2.5 py-1 rounded-xl border border-[var(--accent-primary)]/20">
                              {c.code}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 font-bold text-[var(--text-primary)]">
                            {c.type === "PERCENT" ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{c.value}% OFF</span>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">₹{c.value} FLAT OFF</span>
                            )}
                          </td>
                          <td className="py-3.5 px-2 font-semibold text-[var(--text-secondary)]">
                            {c.minimumOrder > 0 ? `₹${c.minimumOrder}` : <span className="text-[var(--text-muted)]">No Minimum</span>}
                          </td>
                          <td className="py-3.5 px-2">
                            <button
                              type="button"
                              onClick={() => handleToggleCoupon(c.id, c.active)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
                                c.active
                                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                  : "bg-slate-500/10 border border-slate-500/30 text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {c.active ? <ToggleRight className="w-3.5 h-3.5 text-emerald-500" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                              <span>{c.active ? "ACTIVE" : "INACTIVE"}</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteCoupon(c.id, c.code)}
                              className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                              title="Delete Promo Code"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
