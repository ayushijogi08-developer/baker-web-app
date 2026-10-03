import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { Product, StoreSettings } from "../types";

export interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  categoryName?: string;
  sizeLabel: string;
  unitPrice: number;
  isEggless: boolean;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    selectedSize?: { label: string; priceOverride?: number | null },
    quantity?: number,
    openDrawer?: boolean
  ) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  discountAmount: number;
  baseDeliveryFee: number;
  distanceSurcharge: number;
  deliveryFee: number;
  deliveryDistanceKm: number;
  baseIncludedKm: number;
  extraKmFee: number;
  maxDeliveryDistanceKm: number;
  isBeyondMaxDistance: boolean;
  setDeliveryDistanceKm: (km: number) => void;
  grandTotal: number;
  totalItemCount: number;
  appliedCoupon: any | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  couponError: string;
  deliveryMethod: "delivery" | "pickup";
  setDeliveryMethod: (method: "delivery" | "pickup") => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  storeSettings: StoreSettings | null;
  refreshSettings: () => Promise<void>;
  activeCoupons: Array<{
    id: string;
    code: string;
    type: "PERCENT" | "FLAT";
    value: number;
    minimumOrder: number;
    active: boolean;
  }>;
  refreshCoupons: () => Promise<void>;
  reorderLastItems: () => void;
  cartBounceKey: number;
  triggerCartBounce: () => void;
  validateCart: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("thb_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("pickup");
  const [deliveryDistanceKm, setDeliveryDistanceKm] = useState<number>(3);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [activeCoupons, setActiveCoupons] = useState<Array<any>>([]);
  const [cartBounceKey, setCartBounceKey] = useState<number>(0);

  const triggerCartBounce = () => {
    setCartBounceKey((prev) => prev + 1);
  };

  const refreshCoupons = async () => {
    try {
      const res = await api.get("/coupons/active");
      setActiveCoupons(res.data || []);
    } catch (err) {
      console.error("Error loading active coupons:", err);
    }
  };

  const refreshSettings = async () => {
    try {
      const res = await api.get("/settings");
      setStoreSettings(res.data);
      await refreshCoupons();
    } catch (err) {
      console.error("Error loading store settings:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("thb_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const validateCart = async (): Promise<boolean> => {
    if (cartItems.length === 0) return true;
    try {
      const res = await api.post("/products/validate-cart", { items: cartItems });
      const { removedItems, validCartItems } = res.data;
      if (removedItems && removedItems.length > 0) {
        setCartItems(validCartItems);
        const itemNames = removedItems.map((i: any) => `'${i.name}'`).join(", ");
        alert(`Notice: ${itemNames} ${removedItems.length > 1 ? "are" : "is"} no longer available or out of stock and ${removedItems.length > 1 ? "were" : "was"} removed from your cart.`);
        return false;
      }
      return true;
    } catch (err) {
      console.warn("Could not validate cart items:", err);
      return true;
    }
  };

  useEffect(() => {
    refreshSettings();
    refreshCoupons();
    validateCart();

    const handleFocus = () => {
      validateCart();
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    if (isCartDrawerOpen || isCheckoutModalOpen) {
      validateCart();
    }
  }, [isCartDrawerOpen, isCheckoutModalOpen]);

  const addToCart = (
    product: Product,
    selectedSize?: { label: string; priceOverride?: number | null },
    quantity = 1,
    openDrawer = false
  ) => {
    triggerCartBounce();
    const sizeLabel = selectedSize?.label || (product.sizes && product.sizes[0]?.label) || "Standard";
    const unitPrice = selectedSize?.priceOverride || product.discountPrice || product.price;
    const cartId = `${product.id}-${sizeLabel.replace(/\s+/g, "_")}`;

    const mainImage = product.images && product.images[0] ? product.images[0].url : "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80";

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartId === cartId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            cartId,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image: mainImage,
            categoryName: product.category?.name,
            sizeLabel,
            unitPrice,
            isEggless: product.isEggless,
            quantity
          }
        ];
      }
    });

    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (cartId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    if (cartItems.length > 0) {
      try {
        localStorage.setItem("thb_last_order", JSON.stringify(cartItems));
      } catch (err) {
        console.error("Failed to save last order", err);
      }
    }
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponError("");
  };

  const reorderLastItems = () => {
    try {
      const saved = localStorage.getItem("thb_last_order");
      if (saved) {
        const items = JSON.parse(saved);
        if (Array.isArray(items) && items.length > 0) {
          setCartItems(items);
          triggerCartBounce();
        }
      }
    } catch (err) {
      console.error("Failed to reorder last items", err);
    }
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError("");
    const currentSubtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    try {
      const res = await api.get(`/coupons/validate?code=${encodeURIComponent(code)}&amount=${currentSubtotal}`);
      if (res.data.valid) {
        setAppliedCoupon(res.data);
        setCouponError("");
        return true;
      }
      return false;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to validate promo code.";
      setCouponError(errMsg);
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  // Cart Items Watcher: Auto-recalculate & invalidate coupon if subtotal drops below required minimum order
  useEffect(() => {
    if (!appliedCoupon) return;

    const currentSubtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    // If cart becomes empty, remove coupon cleanly
    if (currentSubtotal === 0) {
      setAppliedCoupon(null);
      setCouponError("");
      return;
    }

    const minOrderReq = Number(appliedCoupon.minimumOrder) || 0;

    // If current subtotal drops below minimum order required by applied coupon
    if (minOrderReq > 0 && currentSubtotal < minOrderReq) {
      const codeName = appliedCoupon.code;
      setAppliedCoupon(null);
      setCouponError(`Code "${codeName}" removed: Requires a minimum order of ₹${minOrderReq}.`);
    } else if (appliedCoupon.type === "PERCENT") {
      // Recalculate percentage discount for new subtotal
      const newDiscount = Math.round((currentSubtotal * appliedCoupon.value) / 100);
      if (appliedCoupon.discount !== newDiscount) {
        setAppliedCoupon((prev: any) => (prev ? { ...prev, discount: newDiscount } : null));
      }
      setCouponError("");
    } else {
      setCouponError("");
    }
  }, [cartItems, appliedCoupon]);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    discountAmount = appliedCoupon.discount || 0;
  }

  const freeThreshold = storeSettings?.freeDeliveryThreshold ?? 500;
  const standardFee = storeSettings?.deliveryFee ?? 40;
  const baseKm = storeSettings?.baseIncludedKm ?? 2;
  const perKmFee = storeSettings?.extraKmFee ?? 10;
  const maxKm = storeSettings?.maxDeliveryDistanceKm ?? 30;

  let baseDeliveryFee = 0;
  let distanceSurcharge = 0;

  if (deliveryMethod === "delivery" && subtotal > 0) {
    // Base delivery fee applies if order subtotal is below free threshold
    if (subtotal < freeThreshold) {
      baseDeliveryFee = standardFee;
    }
    // Distance surcharge for any distance beyond baseIncludedKm ALWAYS applies
    const extraKm = Math.max(0, deliveryDistanceKm - baseKm);
    distanceSurcharge = Math.round(extraKm * perKmFee * 10) / 10;
  }

  const deliveryFee = deliveryMethod === "delivery" ? baseDeliveryFee + distanceSurcharge : 0;
  const isBeyondMaxDistance = deliveryMethod === "delivery" && deliveryDistanceKm > maxKm;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        discountAmount,
        baseDeliveryFee,
        distanceSurcharge,
        deliveryFee,
        deliveryDistanceKm,
        baseIncludedKm: baseKm,
        extraKmFee: perKmFee,
        maxDeliveryDistanceKm: maxKm,
        isBeyondMaxDistance,
        setDeliveryDistanceKm,
        grandTotal,
        totalItemCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponError,
        deliveryMethod,
        setDeliveryMethod,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        storeSettings,
        refreshSettings,
        activeCoupons,
        refreshCoupons,
        reorderLastItems,
        cartBounceKey,
        triggerCartBounce,
        validateCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
