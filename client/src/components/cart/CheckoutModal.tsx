import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  X,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  User,
  Clock,
  QrCode,
  Store,
  ArrowLeft,
  ArrowRight,
  Search,
  ShoppingBag,
  CreditCard,
  Home,
  Building2,
  Plus,
  Edit2,
  Trash2,
  Truck,
  Check,
  Pencil,
  Tag,
  AlertCircle,
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui/Button";
import { fetchRealDistanceKm } from "../../utils/distance";
import { loadRazorpayScript } from "../../utils/razorpay";
import { getStoreOpenStatus } from "../../utils/storeTiming";

export interface SavedAddress {
  id: string;
  label: "Home" | "Work" | "Other";
  name?: string;
  phone?: string;
  houseNo: string;
  area: string;
  landmark?: string;
  city: string;
  pincode: string;
  formattedAddress: string;
  isDefault?: boolean;
}

const STORAGE_KEY_ADDRESSES = "thb_saved_addresses";
const STORAGE_KEY_PROFILE = "thb_customer_profile";

const SEED_ADDRESSES: SavedAddress[] = [
  {
    id: "addr_home_1",
    label: "Home",
    name: "Rajesh Kumar",
    phone: "9876543210",
    houseNo: "Flat 204, Shanti Niketan Apts",
    area: "Necklace Road, New Radhakisan Plots",
    landmark: "Near LRT College",
    city: "Akola",
    pincode: "444001",
    formattedAddress: "Flat 204, Shanti Niketan Apts, Necklace Road, New Radhakisan Plots, Near LRT College, Akola - 444001",
    isDefault: true
  },
  {
    id: "addr_work_1",
    label: "Work",
    name: "Rajesh Kumar",
    phone: "9876543210",
    houseNo: "Office #12, Commercial Complex",
    area: "Civil Lines",
    landmark: "Opposite Collectorate Office",
    city: "Akola",
    pincode: "444001",
    formattedAddress: "Office #12, Commercial Complex, Civil Lines, Opposite Collectorate Office, Akola - 444001",
    isDefault: false
  }
];

export const CheckoutModal: React.FC = () => {
  const {
    cartItems,
    subtotal,
    discountAmount,
    baseDeliveryFee,
    distanceSurcharge,
    deliveryFee,
    deliveryDistanceKm,
    setDeliveryDistanceKm,
    baseIncludedKm = 5,
    extraKmFee = 10,
    maxDeliveryDistanceKm = 30,
    isBeyondMaxDistance = false,
    grandTotal,
    appliedCoupon,
    deliveryMethod,
    setDeliveryMethod,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    setIsCartDrawerOpen,
    clearCart,
    storeSettings,
    validateCart
  } = useCart();

  // Declared and initialized deliveryDistance variable with safe default fallbacks
  const deliveryDistance =
    typeof deliveryDistanceKm === "number" && !isNaN(deliveryDistanceKm)
      ? deliveryDistanceKm
      : 0;

  const storeTiming = getStoreOpenStatus(storeSettings);
  const isStoreClosed = !storeTiming.isOpen;

  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [createdOrderDbId, setCreatedOrderDbId] = useState<string>("");
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>("");
  const [paymentVerifiedStatus, setPaymentVerifiedStatus] = useState<string>("PENDING");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Customer Profile & Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddAddressForm, setShowAddAddressForm] = useState<boolean>(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState<boolean>(false);

  // New Address / Edit Address Form State
  const [newAddrForm, setNewAddrForm] = useState({
    label: "Home" as "Home" | "Work" | "Other",
    name: "",
    phone: "",
    houseNo: "",
    area: "",
    landmark: "",
    city: "Akola",
    pincode: "444001"
  });

  // Customer Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    timeSlot: "Today (As soon as possible - approx 30 mins)",
    paymentMethod: "online"
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 1. Restore Customer Profile & Addresses from localStorage
  useEffect(() => {
    try {
      // Restore addresses
      const rawAddrs = localStorage.getItem(STORAGE_KEY_ADDRESSES);
      let loadedAddrs: SavedAddress[] = rawAddrs ? JSON.parse(rawAddrs) : [];

      if (!loadedAddrs || loadedAddrs.length === 0) {
        loadedAddrs = SEED_ADDRESSES;
        localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(SEED_ADDRESSES));
      }

      setSavedAddresses(loadedAddrs);

      // Restore profile info
      const rawProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (rawProfile) {
        const prof = JSON.parse(rawProfile);
        setFormData((prev) => ({
          ...prev,
          name: prof.name || prev.name,
          phone: prof.phone || prev.phone,
          email: prof.email || prev.email
        }));
        if (prof.lastAddressId && loadedAddrs.some((a) => a.id === prof.lastAddressId)) {
          setSelectedAddressId(prof.lastAddressId);
          const active = loadedAddrs.find((a) => a.id === prof.lastAddressId);
          if (active) {
            setFormData((prev) => ({ ...prev, address: active.formattedAddress }));
          }
        } else if (loadedAddrs.length > 0) {
          const defaultAddr = loadedAddrs.find((a) => a.isDefault) || loadedAddrs[0];
          setSelectedAddressId(defaultAddr.id);
          setFormData((prev) => ({ ...prev, address: defaultAddr.formattedAddress }));
        }
      } else if (loadedAddrs.length > 0) {
        const defaultAddr = loadedAddrs.find((a) => a.isDefault) || loadedAddrs[0];
        setSelectedAddressId(defaultAddr.id);
        setFormData((prev) => ({ ...prev, address: defaultAddr.formattedAddress }));
      }
    } catch (err) {
      console.warn("Could not restore saved addresses or profile:", err);
    }
  }, [isCheckoutModalOpen]);

  // Recalculate distance whenever selected address changes
  useEffect(() => {
    if (deliveryMethod === "delivery" && formData.address) {
      setIsCalculatingDistance(true);
      fetchRealDistanceKm(formData.address).then((res) => {
        setDeliveryDistanceKm(res.distanceKm);
        setIsCalculatingDistance(false);
      });
    }
  }, [formData.address, deliveryMethod]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      if (formErrors.phone) {
        setFormErrors((prev) => ({ ...prev, phone: "" }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle selecting an existing saved address (auto-fills name & phone)
  const handleSelectAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setFormData((prev) => ({
      ...prev,
      address: addr.formattedAddress,
      name: addr.name ? addr.name : prev.name,
      phone: addr.phone ? addr.phone : prev.phone
    }));
    if (formErrors.address) {
      setFormErrors((prev) => ({ ...prev, address: "" }));
    }
  };

  // Handle opening edit address form
  const handleEditAddress = (e: React.MouseEvent, addr: SavedAddress) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    setNewAddrForm({
      label: addr.label,
      name: addr.name || formData.name,
      phone: addr.phone || formData.phone,
      houseNo: addr.houseNo,
      area: addr.area,
      landmark: addr.landmark || "",
      city: addr.city || "Akola",
      pincode: addr.pincode || "444001"
    });
    setShowAddAddressForm(false);
  };

  // Handle adding or updating an address
  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrForm.houseNo.trim() || !newAddrForm.area.trim()) {
      alert("Please fill in Flat/House No. and Street/Area.");
      return;
    }

    const formatted = `${newAddrForm.houseNo.trim()}, ${newAddrForm.area.trim()}${
      newAddrForm.landmark.trim() ? `, Near ${newAddrForm.landmark.trim()}` : ""
    }, ${newAddrForm.city.trim()} - ${newAddrForm.pincode.trim()}`;

    let updated: SavedAddress[];
    let activeId: string;

    const contactName = newAddrForm.name.trim() || formData.name;
    const contactPhone = newAddrForm.phone.trim() || formData.phone;

    if (editingAddressId) {
      activeId = editingAddressId;
      updated = savedAddresses.map((a) =>
        a.id === editingAddressId
          ? {
              ...a,
              label: newAddrForm.label,
              name: contactName,
              phone: contactPhone,
              houseNo: newAddrForm.houseNo.trim(),
              area: newAddrForm.area.trim(),
              landmark: newAddrForm.landmark.trim(),
              city: newAddrForm.city.trim(),
              pincode: newAddrForm.pincode.trim(),
              formattedAddress: formatted
            }
          : a
      );
    } else {
      activeId = `addr_${Date.now()}`;
      const newObj: SavedAddress = {
        id: activeId,
        label: newAddrForm.label,
        name: contactName,
        phone: contactPhone,
        houseNo: newAddrForm.houseNo.trim(),
        area: newAddrForm.area.trim(),
        landmark: newAddrForm.landmark.trim(),
        city: newAddrForm.city.trim(),
        pincode: newAddrForm.pincode.trim(),
        formattedAddress: formatted
      };
      updated = [newObj, ...savedAddresses];
    }

    setSavedAddresses(updated);
    setSelectedAddressId(activeId);
    setFormData((prev) => ({
      ...prev,
      address: formatted,
      name: contactName || prev.name,
      phone: contactPhone || prev.phone
    }));

    setShowAddAddressForm(false);
    setEditingAddressId(null);

    try {
      localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(updated));
    } catch (err) {
      console.warn("Could not save address:", err);
    }

    // Reset new form
    setNewAddrForm({
      label: "Home",
      name: "",
      phone: "",
      houseNo: "",
      area: "",
      landmark: "",
      city: "Akola",
      pincode: "444001"
    });
  };

  // Handle deleting an address
  const handleDeleteAddress = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedAddresses.filter((a) => a.id !== id);
    setSavedAddresses(updated);
    try {
      localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(updated));
    } catch (err) {
      console.warn("Could not update saved addresses:", err);
    }

    if (selectedAddressId === id) {
      if (updated.length > 0) {
        setSelectedAddressId(updated[0].id);
        setFormData((prev) => ({ ...prev, address: updated[0].formattedAddress }));
      } else {
        setSelectedAddressId("");
        setFormData((prev) => ({ ...prev, address: "" }));
      }
    }
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};

    if (deliveryMethod === "delivery") {
      if (!formData.address.trim()) {
        errors.address = "Please select or add a delivery address.";
      }
      if (isBeyondMaxDistance) {
        errors.address = `Selected location (~${deliveryDistance.toFixed(1)} km) exceeds our maximum service radius (${maxDeliveryDistanceKm} km). Please select a closer address.`;
      }
      // Ensure name and phone are populated from selected address profile or defaults
      if (!formData.name.trim()) {
        const activeAddr = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];
        if (activeAddr && activeAddr.name) {
          setFormData((prev) => ({ ...prev, name: activeAddr.name || "Customer" }));
        } else {
          setFormData((prev) => ({ ...prev, name: "Customer" }));
        }
      }
      if (!formData.phone.trim()) {
        const activeAddr = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];
        if (activeAddr && activeAddr.phone) {
          setFormData((prev) => ({ ...prev, phone: activeAddr.phone || "9876543210" }));
        } else {
          setFormData((prev) => ({ ...prev, phone: "9876543210" }));
        }
      }
    } else {
      // Store Pickup validation
      if (!formData.name.trim()) errors.name = "Full Name is required for pickup.";
      const cleanPhone = formData.phone.trim().replace(/\D/g, "");
      if (!cleanPhone || cleanPhone.length !== 10) {
        errors.phone = "Valid 10-digit mobile number is required for store pickup.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setDirection(1);
      setStep(2);
    } else if (step === 2) {
      setDirection(1);
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    } else {
      setIsCheckoutModalOpen(false);
      setIsCartDrawerOpen(true);
    }
  };

  const saveRecentOrder = (orderNum: string) => {
    try {
      const existing = JSON.parse(localStorage.getItem("thb_recent_orders") || "[]");
      const newRecord = {
        orderNumber: orderNum,
        customerPhone: formData.phone.trim(),
        customerName: formData.name.trim(),
        total: grandTotal,
        date: new Date().toLocaleDateString()
      };
      const updated = [newRecord, ...existing.filter((o: any) => o.orderNumber !== orderNum)].slice(
        0,
        5
      );
      localStorage.setItem("thb_recent_orders", JSON.stringify(updated));

      // Save Profile
      const prof = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        lastAddressId: selectedAddressId
      };
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(prof));
    } catch (err) {
      console.warn("Could not save to recent orders:", err);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    if (isStoreClosed) {
      setIsSubmitting(false);
      setErrorMessage(storeTiming.notice || "Store is currently closed for orders and delivery.");
      return;
    }

    try {
      let targetOrderId = createdOrderDbId;
      let targetOrderNum = createdOrderNumber;

      if (!targetOrderId) {
        const payload = {
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          orderType: deliveryMethod === "delivery" ? "DELIVERY" : "PICKUP",
          deliveryAddress:
            deliveryMethod === "delivery"
              ? formData.address
              : `Bakery Counter Pickup (${
                  storeSettings?.address ||
                  "Infront of LRT College, Necklace Road, Akola"
                })`,
          scheduledDate: "Today",
          scheduledTime: formData.timeSlot,
          paymentMethod: formData.paymentMethod,
          couponCode: appliedCoupon?.code,
          notes: formData.notes,
          deliveryFee: deliveryFee,
          items: cartItems.map((item) => ({
            productId: item.productId,
            slug: item.slug,
            name: item.name,
            sizeLabel: item.sizeLabel,
            quantity: item.quantity
          }))
        };

        const response = await api.post("/orders", payload);
        const createdOrder = response.data.order;
        targetOrderId = createdOrder.id;
        targetOrderNum = createdOrder.orderNumber;
        setCreatedOrderDbId(targetOrderId);
        setCreatedOrderNumber(targetOrderNum);
      }

      if (formData.paymentMethod === "online") {
        const payOrderRes = await api.post(`/orders/${targetOrderId}/create-payment`);
        const { razorpayOrderId, amount, currency, keyId, orderNumber, customer } = payOrderRes.data;

        const isInvalidKey = (k: string) =>
          !k || k.includes("your_key") || k.includes("placeholder") || k.includes("xxxx");

        let razorpayKey = keyId;
        if (isInvalidKey(razorpayKey)) {
          razorpayKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "";
        }

        if (isInvalidKey(razorpayKey)) {
          setIsSubmitting(false);
          setErrorMessage(
            "Razorpay Key ID is invalid or placeholder. Please ensure RAZORPAY_KEY_ID=rzp_test_... is configured in your backend."
          );
          return;
        }

        const isLoaded = await loadRazorpayScript();
        if (!isLoaded || typeof (window as any).Razorpay === "undefined") {
          setIsSubmitting(false);
          setErrorMessage("Failed to load Razorpay Payment Gateway script.");
          return;
        }

        try {
          const options = {
            key: razorpayKey,
            amount: amount,
            currency: currency || "INR",
            name: storeSettings?.storeName || "The Hidden Bakers",
            description: `Bakery Order #${orderNumber || targetOrderNum}`,
            order_id: razorpayOrderId,
            prefill: {
              name: customer?.name || formData.name,
              email: customer?.email || formData.email || "",
              contact: customer?.phone || formData.phone
            },
            theme: {
              color: "#d97706"
            },
            handler: async function (response: any) {
              try {
                setIsSubmitting(true);
                const verifyRes = await api.post(`/orders/${targetOrderId}/verify-payment`, {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                });

                if (verifyRes.data && verifyRes.data.success) {
                  setOrderId(targetOrderNum);
                  setPaymentVerifiedStatus("PAID");
                  saveRecentOrder(targetOrderNum);
                  clearCart();
                  setIsSubmitted(true);
                } else {
                  setErrorMessage(verifyRes.data?.message || "Payment verification failed on server.");
                }
              } catch (err: any) {
                setErrorMessage(err.response?.data?.message || "Payment verification failed.");
              } finally {
                setIsSubmitting(false);
              }
            },
            modal: {
              ondismiss: function () {
                setIsSubmitting(false);
                setErrorMessage(
                  "Payment window closed. Click 'Confirm & Place Order' to retry or choose another payment method."
                );
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on("payment.failed", function (failResp: any) {
            setIsSubmitting(false);
            setErrorMessage(failResp.error?.description || "Payment failed via Razorpay.");
          });
          rzp.open();
        } catch (err: any) {
          setIsSubmitting(false);
          setErrorMessage(err.message || "Could not launch Razorpay Checkout.");
        }
      } else {
        setOrderId(targetOrderNum);
        setPaymentVerifiedStatus("PENDING");
        saveRecentOrder(targetOrderNum);
        clearCart();
        setIsSubmitted(true);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Error submitting order. Please try again.");
      setIsSubmitting(false);
      validateCart();
    }
  };

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    if (isSubmitted) {
      clearCart();
      setStep(1);
      setCreatedOrderDbId("");
      setCreatedOrderNumber("");
      setIsSubmitted(false);
    }
  };

  const stepVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0
    })
  };

  return (
    <AnimatePresence>
      {isCheckoutModalOpen && (
        <div key="checkout-modal-wrapper-container" className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <motion.div
            key="checkout-modal-backdrop-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Card Container */}
          <motion.div
            key="checkout-modal-card-body"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="relative z-10 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
          >
            {/* Modal Header - Fixed Top */}
            <div className="p-4 sm:p-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)] shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                  Direct Bakery Checkout
                </span>
                <h2 className="font-serif-heading font-bold text-lg sm:text-xl text-[var(--text-primary)]">
                  {isSubmitted ? "Order Placed Successfully 🎉" : "Checkout & Order Confirmation"}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Modal Body - Scrollable Middle */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 box-border min-h-0 space-y-4">
              {!isSubmitted ? (
                <div>
                  {/* Step Progress Bar */}
                  <div className="flex items-center justify-between mb-8 px-4">
                    {[
                      { num: 1, label: "Details & Address" },
                      { num: 2, label: "Slot & Method" },
                      { num: 3, label: "Review & Confirm" }
                    ].map((s) => (
                      <div key={s.num} className="flex items-center gap-2">
                        <motion.div
                          animate={{ scale: step === s.num ? 1.08 : 1 }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            step >= s.num
                              ? "bg-[var(--accent-primary)] text-white"
                              : "bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]"
                          }`}
                        >
                          {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                        </motion.div>
                        <span
                          className={`text-xs font-semibold hidden sm:inline ${
                            step >= s.num ? "text-[var(--text-primary)] font-bold" : "text-[var(--text-muted)]"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Step Form Content */}
                  <div className="overflow-hidden min-h-[300px]">
                    <AnimatePresence mode="wait" custom={direction}>
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          custom={direction}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="space-y-5"
                        >
                          {/* 1. Order Option Selector (Home Delivery vs Store Pickup) */}
                          <div>
                            <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                              Choose Order Fulfillment Option *
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setDeliveryMethod("delivery")}
                                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all text-left cursor-pointer ${
                                  deliveryMethod === "delivery"
                                    ? "bg-[var(--accent-light)] border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/20"
                                    : "bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)]"
                                }`}
                              >
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                    deliveryMethod === "delivery"
                                      ? "bg-[var(--accent-primary)] text-white"
                                      : "bg-[var(--bg-card)] text-[var(--text-muted)]"
                                  }`}
                                >
                                  <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                  <span className="font-extrabold text-xs text-[var(--text-primary)] block">
                                    Doorstep Delivery
                                  </span>
                                  <span className="text-[10px] text-[var(--text-secondary)] block">
                                    Delivered in Akola (~30-45 mins)
                                  </span>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => setDeliveryMethod("pickup")}
                                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all text-left cursor-pointer ${
                                  deliveryMethod === "pickup"
                                    ? "bg-[var(--accent-light)] border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/20"
                                    : "bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)]"
                                }`}
                              >
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                    deliveryMethod === "pickup"
                                      ? "bg-[var(--accent-primary)] text-white"
                                      : "bg-[var(--bg-card)] text-[var(--text-muted)]"
                                  }`}
                                >
                                  <Store className="w-5 h-5" />
                                </div>
                                <div>
                                  <span className="font-extrabold text-xs text-[var(--text-primary)] block">
                                    Store Pickup
                                  </span>
                                  <span className="text-[10px] text-[var(--text-secondary)] block">
                                    Collect at Bakery Counter (Free)
                                  </span>
                                </div>
                              </button>
                            </div>

                            {/* Interactive Delivery Distance Radius Visualizer */}
                            {deliveryMethod === "delivery" && (
                              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
                                <div className="flex items-center justify-between font-extrabold text-[var(--text-primary)]">
                                  <span className="flex items-center gap-1.5 text-[var(--accent-primary)]">
                                    <Navigation className="w-4 h-4 animate-bounce text-amber-500" />
                                    <span>Akola Store Delivery Radius Visualizer</span>
                                  </span>
                                  <span className="text-[11px] bg-amber-500 text-amber-950 px-2 py-0.5 rounded-full font-black">
                                    {deliveryDistanceKm} KM away
                                  </span>
                                </div>

                                {/* Visual Distance Track Bar */}
                                <div className="relative w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border-color)] mt-1">
                                  <div
                                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500 rounded-full"
                                    style={{ width: `${Math.min(100, (deliveryDistanceKm / maxDeliveryDistanceKm) * 100)}%` }}
                                  />
                                </div>

                                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-bold pt-0.5">
                                  <span>🏬 Store (Necklace Rd)</span>
                                  <span>{baseIncludedKm} KM Included Free</span>
                                  <span>Max {maxDeliveryDistanceKm} KM Radius</span>
                                </div>

                                <div className="text-[11px] text-[var(--text-secondary)] font-medium pt-1 flex items-center justify-between">
                                  <span>
                                    {deliveryDistanceKm <= baseIncludedKm
                                      ? `Within ${baseIncludedKm} KM base allowance!`
                                      : `+${(deliveryDistanceKm - baseIncludedKm).toFixed(1)} KM extra distance`}
                                  </span>
                                  <span className="font-extrabold text-[var(--text-primary)]">
                                    {deliveryFee === 0 ? "FREE Delivery 🎉" : `Delivery Fee: ₹${deliveryFee}`}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 2. Store Pickup Contact Details (Shown only when Store Pickup is active) */}
                          {deliveryMethod === "pickup" && (
                            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-3">
                              <label className="block text-xs font-extrabold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-1.5">
                                <User className="w-4 h-4" /> Store Pickup Contact Information
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                    Full Name *
                                  </label>
                                  <div className="relative">
                                    <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
                                    <input
                                      type="text"
                                      name="name"
                                      value={formData.name}
                                      onChange={handleInputChange}
                                      placeholder="e.g. Rajesh Kumar"
                                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-medium"
                                    />
                                  </div>
                                  {formErrors.name && (
                                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.name}</p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                    Phone Number *
                                  </label>
                                  <div className="relative">
                                    <Phone className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
                                    <input
                                      type="tel"
                                      name="phone"
                                      maxLength={10}
                                      inputMode="numeric"
                                      pattern="[0-9]{10}"
                                      value={formData.phone}
                                      onChange={handleInputChange}
                                      placeholder="10-digit mobile"
                                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono font-medium"
                                    />
                                  </div>
                                  {formErrors.phone && (
                                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 3. Address Selection UI when Home Delivery is active */}
                          {deliveryMethod === "delivery" ? (
                            <div className="space-y-3 pt-1">
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4" /> Select Delivery Address
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (showAddAddressForm || editingAddressId) {
                                      setShowAddAddressForm(false);
                                      setEditingAddressId(null);
                                    } else {
                                      setEditingAddressId(null);
                                      setNewAddrForm({
                                        label: "Home",
                                        name: formData.name || "",
                                        phone: formData.phone || "",
                                        houseNo: "",
                                        area: "",
                                        landmark: "",
                                        city: "Akola",
                                        pincode: "444001"
                                      });
                                      setShowAddAddressForm(true);
                                    }
                                  }}
                                  className="text-xs font-extrabold text-[var(--accent-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  {showAddAddressForm || editingAddressId ? (
                                    <>
                                      <X className="w-3.5 h-3.5" />
                                      <span>Cancel</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>+ Add New Address</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Saved Address Cards Picker / Inline Edit & New Forms */}
                              <div className="grid grid-cols-1 gap-2.5">
                                {/* New Address Form at top when adding a new address */}
                                <AnimatePresence>
                                  {showAddAddressForm && !editingAddressId && (
                                    <motion.form
                                      key="new-address-form"
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      onSubmit={handleSaveNewAddress}
                                      className="p-4 bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] rounded-2xl space-y-3 text-xs overflow-hidden shadow-xs"
                                    >
                                      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                                        <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                                          <Plus className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                                          Add New Delivery Location
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <div className="flex gap-1.5">
                                            {(["Home", "Work", "Other"] as const).map((tag) => (
                                              <button
                                                key={tag}
                                                type="button"
                                                onClick={() =>
                                                  setNewAddrForm((prev) => ({ ...prev, label: tag }))
                                                }
                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                                  newAddrForm.label === tag
                                                    ? "bg-[var(--accent-primary)] text-white"
                                                    : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]"
                                                }`}
                                              >
                                                {tag}
                                              </button>
                                            ))}
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setShowAddAddressForm(false);
                                              setEditingAddressId(null);
                                            }}
                                            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-hover)]"
                                            title="Cancel"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Contact Name & Phone Storage Inputs */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <div>
                                          <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                            Contact Full Name
                                          </label>
                                          <input
                                            type="text"
                                            value={newAddrForm.name}
                                            onChange={(e) =>
                                              setNewAddrForm((prev) => ({
                                                ...prev,
                                                name: e.target.value
                                              }))
                                            }
                                            placeholder="e.g. Rajesh Kumar"
                                            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs font-medium"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                            Contact Mobile Number
                                          </label>
                                          <input
                                            type="tel"
                                            maxLength={10}
                                            value={newAddrForm.phone}
                                            onChange={(e) =>
                                              setNewAddrForm((prev) => ({
                                                ...prev,
                                                phone: e.target.value.replace(/\D/g, "").slice(0, 10)
                                              }))
                                            }
                                            placeholder="10-digit mobile"
                                            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono text-xs font-medium"
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <div>
                                          <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                            Flat / House No. / Building *
                                          </label>
                                          <input
                                            type="text"
                                            required
                                            value={newAddrForm.houseNo}
                                            onChange={(e) =>
                                              setNewAddrForm((prev) => ({
                                                ...prev,
                                                houseNo: e.target.value
                                              }))
                                            }
                                            placeholder="e.g. Flat 302, Sai Residency"
                                            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-medium"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                            Street / Area / Colony *
                                          </label>
                                          <input
                                            type="text"
                                            required
                                            value={newAddrForm.area}
                                            onChange={(e) =>
                                              setNewAddrForm((prev) => ({
                                                ...prev,
                                                area: e.target.value
                                              }))
                                            }
                                            placeholder="e.g. Necklace Road, Civil Lines"
                                            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-medium"
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                        <div>
                                          <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                            Landmark (Optional)
                                          </label>
                                          <input
                                            type="text"
                                            value={newAddrForm.landmark}
                                            onChange={(e) =>
                                              setNewAddrForm((prev) => ({
                                                ...prev,
                                                landmark: e.target.value
                                              }))
                                            }
                                            placeholder="e.g. Near LRT College"
                                            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-medium"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                            City
                                          </label>
                                          <input
                                            type="text"
                                            value={newAddrForm.city}
                                            onChange={(e) =>
                                              setNewAddrForm((prev) => ({
                                                ...prev,
                                                city: e.target.value
                                              }))
                                            }
                                            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                            Pincode *
                                          </label>
                                          <input
                                            type="text"
                                            maxLength={6}
                                            value={newAddrForm.pincode}
                                            onChange={(e) =>
                                              setNewAddrForm((prev) => ({
                                                ...prev,
                                                pincode: e.target.value
                                              }))
                                            }
                                            placeholder="444001"
                                            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono font-medium"
                                          />
                                        </div>
                                      </div>

                                      <div className="flex gap-2 pt-1">
                                        <Button type="submit" variant="primary" size="sm" className="flex-1 font-bold">
                                          Save & Deliver to This Address
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="secondary"
                                          size="sm"
                                          onClick={() => {
                                            setShowAddAddressForm(false);
                                            setEditingAddressId(null);
                                          }}
                                          className="font-bold px-4"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </motion.form>
                                  )}
                                </AnimatePresence>

                                {savedAddresses.map((addr) => {
                                  // If this address card is currently being edited, render the edit form in place!
                                  if (editingAddressId === addr.id) {
                                    return (
                                      <motion.form
                                        key={addr.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        onSubmit={handleSaveNewAddress}
                                        className="p-4 bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] rounded-2xl space-y-3 text-xs shadow-xs"
                                      >
                                        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                                          <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                                            <Pencil className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                                            Edit Delivery Location & Contact
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <div className="flex gap-1.5">
                                              {(["Home", "Work", "Other"] as const).map((tag) => (
                                                <button
                                                  key={tag}
                                                  type="button"
                                                  onClick={() =>
                                                    setNewAddrForm((prev) => ({ ...prev, label: tag }))
                                                  }
                                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                                    newAddrForm.label === tag
                                                      ? "bg-[var(--accent-primary)] text-white"
                                                      : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]"
                                                  }`}
                                                >
                                                  {tag}
                                                </button>
                                              ))}
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setEditingAddressId(null);
                                                setShowAddAddressForm(false);
                                              }}
                                              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-hover)]"
                                              title="Cancel edit"
                                            >
                                              <X className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </div>

                                        {/* Contact Name & Phone Storage Inputs */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                          <div>
                                            <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                              Contact Full Name
                                            </label>
                                            <input
                                              type="text"
                                              value={newAddrForm.name}
                                              onChange={(e) =>
                                                setNewAddrForm((prev) => ({
                                                  ...prev,
                                                  name: e.target.value
                                                }))
                                              }
                                              placeholder="e.g. Rajesh Kumar"
                                              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs font-medium"
                                            />
                                          </div>

                                          <div>
                                            <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                              Contact Mobile Number
                                            </label>
                                            <input
                                              type="tel"
                                              maxLength={10}
                                              value={newAddrForm.phone}
                                              onChange={(e) =>
                                                setNewAddrForm((prev) => ({
                                                  ...prev,
                                                  phone: e.target.value.replace(/\D/g, "").slice(0, 10)
                                                }))
                                              }
                                              placeholder="10-digit mobile"
                                              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono text-xs font-medium"
                                            />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                          <div>
                                            <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                              Flat / House No. / Building *
                                            </label>
                                            <input
                                              type="text"
                                              required
                                              value={newAddrForm.houseNo}
                                              onChange={(e) =>
                                                setNewAddrForm((prev) => ({
                                                  ...prev,
                                                  houseNo: e.target.value
                                                }))
                                              }
                                              placeholder="e.g. Flat 302, Sai Residency"
                                              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-medium"
                                            />
                                          </div>

                                          <div>
                                            <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                              Street / Area / Colony *
                                            </label>
                                            <input
                                              type="text"
                                              required
                                              value={newAddrForm.area}
                                              onChange={(e) =>
                                                setNewAddrForm((prev) => ({
                                                  ...prev,
                                                  area: e.target.value
                                                }))
                                              }
                                              placeholder="e.g. Necklace Road, Civil Lines"
                                              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-medium"
                                            />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                          <div>
                                            <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                              Landmark (Optional)
                                            </label>
                                            <input
                                              type="text"
                                              value={newAddrForm.landmark}
                                              onChange={(e) =>
                                                setNewAddrForm((prev) => ({
                                                  ...prev,
                                                  landmark: e.target.value
                                                }))
                                              }
                                              placeholder="e.g. Near LRT College"
                                              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-medium"
                                            />
                                          </div>

                                          <div>
                                            <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                              City
                                            </label>
                                            <input
                                              type="text"
                                              value={newAddrForm.city}
                                              onChange={(e) =>
                                                setNewAddrForm((prev) => ({
                                                  ...prev,
                                                  city: e.target.value
                                                }))
                                              }
                                              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium"
                                            />
                                          </div>

                                          <div>
                                            <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">
                                              Pincode *
                                            </label>
                                            <input
                                              type="text"
                                              maxLength={6}
                                              value={newAddrForm.pincode}
                                              onChange={(e) =>
                                                setNewAddrForm((prev) => ({
                                                  ...prev,
                                                  pincode: e.target.value
                                                }))
                                              }
                                              placeholder="444001"
                                              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono font-medium"
                                            />
                                          </div>
                                        </div>

                                        <div className="flex gap-2 pt-1">
                                          <Button type="submit" variant="primary" size="sm" className="flex-1 font-bold">
                                            Save Changes & Select Address
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => {
                                              setEditingAddressId(null);
                                              setShowAddAddressForm(false);
                                            }}
                                            className="font-bold px-4"
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </motion.form>
                                    );
                                  }

                                  const isSelected = selectedAddressId === addr.id;
                                  const IconComponent =
                                    addr.label === "Home"
                                      ? Home
                                      : addr.label === "Work"
                                      ? Building2
                                      : MapPin;

                                  return (
                                    <div
                                      key={addr.id}
                                      onClick={() => handleSelectAddress(addr)}
                                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                                        isSelected
                                          ? "bg-[var(--accent-light)] border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/20 shadow-xs"
                                          : "bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)]"
                                      }`}
                                    >
                                      <div className="flex items-start gap-3 min-w-0">
                                        <div
                                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                            isSelected
                                              ? "bg-[var(--accent-primary)] text-white"
                                              : "bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]"
                                          }`}
                                        >
                                          <IconComponent className="w-4 h-4" />
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className="font-extrabold text-xs text-[var(--text-primary)]">
                                              {addr.houseNo}
                                            </span>
                                            <span
                                              className={`text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-full ${
                                                addr.label === "Home"
                                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                                  : addr.label === "Work"
                                                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                                              }`}
                                            >
                                              {addr.label}
                                            </span>
                                          </div>
                                          <p className="text-[11px] text-[var(--text-secondary)] truncate">
                                            {addr.area}, {addr.city} - {addr.pincode}
                                          </p>
                                          {addr.landmark && (
                                            <p className="text-[10px] text-[var(--text-muted)]">
                                              Landmark: {addr.landmark}
                                            </p>
                                          )}
                                          {(addr.name || addr.phone) && (
                                            <p className="text-[10px] font-bold text-[var(--accent-primary)] flex items-center gap-2 pt-0.5">
                                              {addr.name && <span>👤 {addr.name}</span>}
                                              {addr.phone && <span>📞 {addr.phone}</span>}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          type="button"
                                          onClick={(e) => handleEditAddress(e, addr)}
                                          className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] p-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                                          title="Edit saved address"
                                        >
                                          <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        {savedAddresses.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={(e) => handleDeleteAddress(e, addr.id)}
                                            className="text-[var(--text-muted)] hover:text-rose-500 p-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                                            title="Delete saved address"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                        {isSelected && (
                                          <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center">
                                            <Check className="w-3.5 h-3.5" />
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              {formErrors.address && (
                                <p className="text-[11px] text-rose-500 font-medium">
                                  {formErrors.address}
                                </p>
                              )}
                            </div>
                          ) : (
                            /* Store Pickup Address Info Box */
                            <div className="p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-xs space-y-1">
                              <div className="flex items-center gap-2 font-bold text-[var(--accent-primary)]">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span>Bakery Pickup Address:</span>
                              </div>
                              <p className="text-[11px] text-[var(--text-secondary)] pl-6">
                                {storeSettings?.address ||
                                  "Infront of LRT College, Necklace Road, New Radhakisan Plots, Akola, Maharashtra 444001"}
                              </p>
                            </div>
                          )}

                          <div>
                            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                              Custom Cake / Delivery Instructions
                            </label>
                            <input
                              type="text"
                              name="notes"
                              value={formData.notes}
                              onChange={handleInputChange}
                              placeholder="e.g. Write 'Happy Birthday Aarav' on cake or leave at doorstep"
                              className="w-full px-3 py-2.5 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-medium"
                            />
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step2"
                          custom={direction}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="space-y-5"
                        >
                          <div>
                            <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                              Select Preferred Time Slot
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {[
                                "Today (As soon as possible - approx 30 mins)",
                                "Today Evening (5:00 PM - 7:00 PM)",
                                "Tomorrow Morning (10:00 AM - 12:00 PM)",
                                "Tomorrow Evening (5:00 PM - 8:00 PM)"
                              ].map((slot) => (
                                <label
                                  key={slot}
                                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                                    formData.timeSlot === slot
                                      ? "bg-[var(--accent-light)] border-[var(--accent-primary)] font-bold text-[var(--accent-primary)]"
                                      : "bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="timeSlot"
                                    value={slot}
                                    checked={formData.timeSlot === slot}
                                    onChange={handleInputChange}
                                    className="hidden"
                                  />
                                  <Clock className="w-4 h-4 shrink-0" />
                                  <span className="leading-tight">{slot}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                              Select Payment Method
                            </label>
                            <div className="space-y-2 text-xs">
                              {[
                                {
                                  id: "online",
                                  title: "Pay Online (UPI / Cards / Netbanking)",
                                  desc: "Fast & secure payment via Razorpay checkout widget",
                                  icon: CreditCard,
                                  badge: "Instant"
                                },
                                {
                                  id: "upi_delivery",
                                  title:
                                    deliveryMethod === "delivery"
                                      ? "Pay via UPI on Doorstep Delivery"
                                      : "Pay via UPI on Pickup",
                                  desc: "Scan GPay / PhonePe / Paytm QR code upon order arrival",
                                  icon: QrCode
                                },
                                {
                                  id: "store",
                                  title:
                                    deliveryMethod === "delivery"
                                      ? "Cash on Delivery (COD)"
                                      : "Cash / Card at Store Counter",
                                  desc: "Pay via Cash when receiving your order",
                                  icon: Store
                                }
                              ].map((pm) => {
                                const Icon = pm.icon;
                                return (
                                  <label
                                    key={pm.id}
                                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                                      formData.paymentMethod === pm.id
                                        ? "bg-[var(--accent-light)] border-[var(--accent-primary)] font-bold text-[var(--text-primary)]"
                                        : "bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="paymentMethod"
                                      value={pm.id}
                                      checked={formData.paymentMethod === pm.id}
                                      onChange={handleInputChange}
                                      className="hidden"
                                    />
                                    <Icon className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <p className="font-semibold text-xs text-[var(--text-primary)]">
                                          {pm.title}
                                        </p>
                                        {pm.badge && (
                                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                            {pm.badge}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                                        {pm.desc}
                                      </p>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="step3"
                          custom={direction}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="space-y-4 text-xs"
                        >
                          <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] space-y-2">
                            <h4 className="font-bold text-sm text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)] flex items-center justify-between">
                              <span>Order Breakdown</span>
                              <span className="text-[var(--accent-primary)] font-serif-heading font-extrabold text-base">
                                ₹{grandTotal}
                              </span>
                            </h4>
                            {cartItems.map((item, index) => {
                              const safeKey =
                                item.cartId ||
                                item.productId ||
                                (item as any)?.id ||
                                (item as any)?._id ||
                                `chk-item-${index}`;
                              return (
                                <div
                                  key={safeKey}
                                  className="flex justify-between py-1 border-b border-[var(--border-color)]/50 text-[var(--text-primary)] font-medium"
                                >
                                  <span>
                                    {item.name} ({item.sizeLabel}) x {item.quantity}
                                  </span>
                                  <span className="font-bold">
                                    ₹{item.unitPrice * item.quantity}
                                  </span>
                                </div>
                              );
                            })}
                            <div className="pt-2 text-[var(--text-secondary)] space-y-1.5">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-semibold text-[var(--text-primary)]">
                                  ₹{subtotal}
                                </span>
                              </div>
                              {discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                                  <span>Discount ({appliedCoupon?.code}):</span>
                                  <span>-₹{discountAmount}</span>
                                </div>
                              )}

                              <div className="flex justify-between text-[var(--text-primary)] font-semibold border-t border-[var(--border-color)]/60 pt-1.5">
                                <span>Fulfillment Method:</span>
                                <span>
                                  {deliveryMethod === "delivery"
                                    ? "Doorstep Home Delivery"
                                    : "Store Pickup (Free)"}
                                </span>
                              </div>

                              {deliveryMethod === "delivery" && (
                                <div className="p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] space-y-2 mt-2 text-xs">
                                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-1.5 font-bold text-[var(--text-primary)]">
                                    <span className="flex items-center gap-1.5">
                                      <Truck className="w-4 h-4 text-[#FC8019]" /> Delivery Calculation Breakdown
                                    </span>
                                    <span className="text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/20">
                                      ~{deliveryDistance ? deliveryDistance.toFixed(1) : "0.0"} km
                                    </span>
                                  </div>

                                  <div className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                                    <div className="flex justify-between">
                                      <span>Base Delivery Fee (up to {baseIncludedKm ?? 5} km):</span>
                                      <span className="font-semibold text-[var(--text-primary)]">
                                        {subtotal >= (storeSettings?.freeDeliveryThreshold ?? 500) ? (
                                          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">FREE (Subtotal ≥ ₹{storeSettings?.freeDeliveryThreshold ?? 500})</span>
                                        ) : (
                                          `₹${baseDeliveryFee ?? 40}`
                                        )}
                                      </span>
                                    </div>

                                    {deliveryDistance > (baseIncludedKm ?? 5) && (
                                      <div className="flex justify-between text-amber-600 dark:text-amber-400">
                                        <span>Extra Distance Surcharge (+{(Math.max(0, deliveryDistance - (baseIncludedKm ?? 5))).toFixed(1)} km @ ₹{extraKmFee ?? 10}/km):</span>
                                        <span className="font-bold">+₹{distanceSurcharge ?? 0}</span>
                                      </div>
                                    )}

                                    <div className="flex justify-between pt-1 border-t border-[var(--border-color)] font-bold text-[var(--text-primary)]">
                                      <span>Total Delivery Charge:</span>
                                      <span className="text-[var(--accent-primary)] font-extrabold">
                                        {deliveryFee === 0 ? "FREE" : `₹${deliveryFee ?? 0}`}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {deliveryMethod === "delivery" && (
                                <div className="p-2.5 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] mt-1">
                                  <p className="text-[11px] font-bold text-[var(--text-primary)]">
                                    Delivering To:
                                  </p>
                                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                                    {formData.address}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {errorMessage && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 font-bold">
                              {errorMessage}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)] mt-6">
                    <Button onClick={handleBack} variant="secondary" size="md">
                      <ArrowLeft className="w-4 h-4 mr-1" />{" "}
                      {step === 1 ? "Back to Cart" : "Back"}
                    </Button>

                    {step < 3 ? (
                      <Button onClick={handleNext} variant="primary" size="md">
                        Continue <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleFinalSubmit}
                        variant="primary"
                        size="lg"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        disabled={isSubmitting}
                      >
                        <ShoppingBag className="w-5 h-5 mr-1" />{" "}
                        {isSubmitting
                          ? "Placing Order..."
                          : `Confirm & Place ${
                              deliveryMethod === "delivery" ? "Delivery" : "Pickup"
                            } Order`}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                /* CELEBRATORY ORDER CONFIRMATION INVOICE */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="py-6 text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: [0, 1.25, 1], rotate: [0, -10, 0] }}
                    transition={{ duration: 0.6, ease: "backOut" }}
                    className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md"
                  >
                    <CheckCircle className="w-10 h-10" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <h3 className="font-serif-heading font-extrabold text-2xl text-[var(--text-primary)]">
                      {deliveryMethod === "delivery"
                        ? "Delivery Order Placed!"
                        : "Store Pickup Order Placed!"}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Your order <b>#{createdOrderNumber}</b> has been received and added to our
                      bakery preparation queue.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] text-left text-xs space-y-2 max-w-md mx-auto shadow-sm"
                  >
                    <div className="flex justify-between font-bold border-b border-[var(--border-color)] pb-2 text-[var(--text-primary)]">
                      <span>Order #{createdOrderNumber}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                        ₹{grandTotal}
                      </span>
                    </div>
                    <p>
                      <b>Customer:</b> {formData.name} ({formData.phone})
                    </p>
                    <p>
                      <b>Fulfillment Method:</b>{" "}
                      {deliveryMethod === "delivery" ? "Doorstep Delivery" : "Store Pickup"}
                    </p>
                    <p>
                      <b>{deliveryMethod === "delivery" ? "Delivery Address:" : "Pickup Location:"}</b>{" "}
                      {deliveryMethod === "delivery"
                        ? formData.address
                        : "Infront of LRT College, Necklace Road, Akola"}
                    </p>
                    <p>
                      <b>Estimated Time:</b> {formData.timeSlot}
                    </p>
                    <p>
                      <b>Payment Status:</b>{" "}
                      <span
                        className={`font-bold ${
                          paymentVerifiedStatus === "PAID"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {paymentVerifiedStatus === "PAID"
                          ? "Paid Online (Verified via Razorpay)"
                          : formData.paymentMethod === "store"
                          ? "Pay Cash/Card on Delivery or Pickup"
                          : "Pay via UPI on Delivery or Pickup"}
                      </span>
                    </p>
                    {formData.notes && <p><b>Instructions:</b> {formData.notes}</p>}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="flex flex-wrap items-center justify-center gap-3 pt-2"
                  >
                    <Link to={`/track-order?phone=${encodeURIComponent(formData.phone)}`}>
                      <Button onClick={handleClose} variant="primary" size="md">
                        <Search className="w-4 h-4 mr-1" /> Track Order Status Live
                      </Button>
                    </Link>
                    <Button onClick={handleClose} variant="secondary" size="md">
                      Back to Bakery
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
