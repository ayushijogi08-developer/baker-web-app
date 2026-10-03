import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, Clock, Truck, Sparkles, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui/Button";
import { getStoreOpenStatus } from "../../utils/storeTiming";

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    setIsCheckoutModalOpen,
    storeSettings,
    reorderLastItems
  } = useCart();

  const [lastOrderItems, setLastOrderItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("thb_last_order");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLastOrderItems(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [isCartDrawerOpen]);

  const freeThreshold = storeSettings?.freeDeliveryThreshold ?? 500;
  const amountToFree = Math.max(0, freeThreshold - subtotal);
  const freeProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const isFreeUnlocked = subtotal >= freeThreshold;

  const storeTiming = getStoreOpenStatus(storeSettings);
  const isStoreClosed = !storeTiming.isOpen;

  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = await applyCoupon(couponInput);
    if (success) setCouponInput("");
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const grandTotal = Math.max(0, subtotal - discountAmount);

  return (
    <>
      <AnimatePresence>
        {isCartDrawerOpen && (
          <div key="cart-drawer-overlay-wrap" className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              key="cart-drawer-backdrop-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsCartDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            <div className="fixed inset-y-0 right-0 top-0 bottom-0 w-full sm:w-[400px] max-w-full flex justify-end pointer-events-none">
              {/* Drawer Container */}
              <motion.div
                key="cart-drawer-panel-body"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="pointer-events-auto w-full sm:w-[400px] sm:max-w-[400px] h-full h-screen bg-[var(--bg-card)] border-l border-[var(--border-color)] text-[var(--text-primary)] shadow-2xl flex flex-col box-border overflow-hidden"
              >
                {/* Drawer Header */}
                <div className="p-4 sm:p-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)] shrink-0 box-border w-full">
                  <div className="flex items-center gap-2 min-w-0">
                    <ShoppingBag className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                    <h2 className="font-serif-heading font-bold text-base sm:text-lg text-[var(--text-primary)] truncate">
                      Your Shopping Cart
                    </h2>
                    <motion.span
                      key={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      initial={{ scale: 0.7 }}
                      animate={{ scale: 1 }}
                      className="bg-[var(--accent-primary)] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shrink-0"
                    >
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </motion.span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Free Delivery Progress Banner */}
                {cartItems.length > 0 && (
                  <div className="px-4 py-3 border-b border-[var(--border-color)] bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 shrink-0 box-border w-full space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-extrabold text-[var(--text-primary)]">
                      <div className="flex items-center gap-1.5">
                        {isFreeUnlocked ? (
                          <Sparkles className="w-4 h-4 text-emerald-600 animate-bounce shrink-0" />
                        ) : (
                          <Truck className="w-4 h-4 text-[#FC8019] shrink-0" />
                        )}
                        <span>
                          {isFreeUnlocked ? (
                            <strong className="text-emerald-600 dark:text-emerald-400">🎉 FREE Delivery Unlocked!</strong>
                          ) : (
                            <>Add <strong className="text-[#FC8019]">₹{amountToFree}</strong> more for <strong>FREE Delivery!</strong></>
                          )}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        ₹{subtotal} / ₹{freeThreshold}
                      </span>
                    </div>

                    <div className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${freeProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          isFreeUnlocked
                            ? "bg-emerald-500"
                            : "bg-gradient-to-r from-[#FC8019] to-amber-400"
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 sm:space-y-4 box-border w-full">
                  {cartItems.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center space-y-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                      </div>
                      <div>
                        <h3 className="font-serif-heading font-bold text-lg text-[var(--text-primary)]">
                          Your Basket is Empty
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto mt-1">
                          Explore our handcrafted Belgian cakes, flaky savory puffs, and fresh sourdough loaves!
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <Button onClick={() => setIsCartDrawerOpen(false)} variant="primary" size="sm">
                          Browse Bakery Menu
                        </Button>

                        {/* Quick Re-Order Last Items Button */}
                        {lastOrderItems.length > 0 && (
                          <div className="pt-3 border-t border-[var(--border-color)] max-w-xs mx-auto space-y-2">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--accent-primary)] flex items-center justify-center gap-1">
                              <RotateCcw className="w-3 h-3" /> Quick Re-Order Previous Favorites
                            </p>
                            <button
                              type="button"
                              onClick={reorderLastItems}
                              className="w-full py-2.5 px-4 rounded-2xl bg-amber-500 text-amber-950 font-black text-xs hover:bg-amber-400 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                            >
                              <Sparkles className="w-4 h-4" /> Repeat Last Order ({lastOrderItems.length} Items)
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <AnimatePresence initial={false}>
                        {cartItems.map((item, index) => {
                          const safeKey = item.cartId || item.productId || (item as any)?.id || (item as any)?._id || `cart-item-${index}`;
                          return (
                            <motion.div
                              key={safeKey}
                              initial={{ opacity: 0, height: 0, scale: 0.95 }}
                              animate={{ opacity: 1, height: "auto", scale: 1 }}
                              exit={{ opacity: 0, height: 0, scale: 0.9, x: 30 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="overflow-hidden"
                            >
                              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xs box-border w-full overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[var(--border-color)] shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] truncate">
                                    {item.name}
                                  </h4>
                                  <p className="text-[11px] sm:text-xs text-[var(--text-muted)] truncate">
                                    {item.sizeLabel}
                                  </p>
                                  <p className="text-xs font-bold text-[var(--accent-primary)] mt-0.5 sm:mt-1 truncate">
                                    ₹{item.unitPrice} × {item.quantity} = ₹{item.unitPrice * item.quantity}
                                  </p>
                                </div>

                                <div className="flex items-center gap-0.5 sm:gap-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1 shrink-0">
                                  <button
                                    onClick={() => updateQuantity(item.cartId, -1)}
                                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] flex items-center justify-center cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <motion.span
                                    key={`qty-${item.cartId || index}-${item.quantity}`}
                                    initial={{ scale: 0.7 }}
                                    animate={{ scale: 1 }}
                                    className="w-4 sm:w-5 text-center text-xs font-bold text-[var(--text-primary)]"
                                  >
                                    {item.quantity}
                                  </motion.span>
                                  <button
                                    onClick={() => updateQuantity(item.cartId, 1)}
                                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] flex items-center justify-center cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <motion.button
                                  whileHover={{ scale: 1.1, color: "#ef4444" }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeFromCart(item.cartId)}
                                  className="text-[var(--text-muted)] hover:text-rose-500 p-1 cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}

                  {cartItems.length > 0 && (
                    <div className="pt-3 border-t border-[var(--border-color)]">
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-emerald-600" />
                            <span>Code <b>{appliedCoupon.code}</b> applied!</span>
                          </div>
                          <button
                            onClick={removeCoupon}
                            className="text-xs underline hover:text-rose-500 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Promo Code (e.g. HIDDEN10)"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] uppercase font-semibold"
                          />
                          <Button type="submit" variant="secondary" size="sm">
                            Apply
                          </Button>
                        </form>
                      )}
                      {couponError && (
                        <p className="text-[11px] text-rose-500 mt-1 font-medium">{couponError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Drawer Footer */}
                {cartItems.length > 0 && (
                  <div className="p-4 sm:p-5 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3 shrink-0 box-border w-full">
                    <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold text-[var(--text-primary)]">₹{subtotal}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                          <span>Coupon Discount</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-[var(--border-color)] text-sm font-extrabold text-[var(--text-primary)]">
                        <span>Grand Total</span>
                        <motion.span
                          key={grandTotal}
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="text-[var(--accent-primary)] font-serif-heading text-lg"
                        >
                          ₹{grandTotal}
                        </motion.span>
                      </div>
                    </div>

                    {isStoreClosed && (
                      <div className="p-3.5 bg-[var(--accent-light)] border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] rounded-2xl text-xs font-extrabold text-center shadow-xs flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 shrink-0 text-[var(--accent-primary)]" />
                        <span>{storeTiming.notice}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Button
                        onClick={handleProceedToCheckout}
                        disabled={isStoreClosed}
                        variant="primary"
                        size="lg"
                        className="w-full font-bold disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {isStoreClosed ? "Store Closed for Orders" : <>Proceed to Checkout <ArrowRight className="w-4 h-4 ml-1" /></>}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
