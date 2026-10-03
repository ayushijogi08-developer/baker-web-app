import React, { useState } from "react";
import { X, Copy, Check, MessageCircle, ExternalLink, ShoppingBag, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui/Button";

interface DeliveryHandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  singleItem?: {
    name: string;
    price: number;
    size?: string;
  };
}

export const DeliveryHandoffModal: React.FC<DeliveryHandoffModalProps> = ({
  isOpen,
  onClose,
  singleItem
}) => {
  const { cartItems, cartTotal, storeSettings } = useCart();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build items array (either cart items or single product)
  const items = singleItem
    ? [{ name: singleItem.name, quantity: 1, size: singleItem.size, price: singleItem.price }]
    : cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        size: item.selectedSize?.label,
        price: (item.selectedSize?.price || item.product.price) * item.quantity
      }));

  const total = singleItem ? singleItem.price : cartTotal;

  // Build plain text order summary for clipboard and WhatsApp
  const orderSummaryLines = items.map(
    item => `• ${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ''} - ₹${item.price}`
  );
  
  const textSummary = `Your Order Summary:\n${orderSummaryLines.join("\n")}\nSubtotal: ₹${total}`;

  const whatsappMessage = `Hello ${storeSettings?.storeName || "The Hidden Bakers"}, I would like to place a delivery order:\n\n${orderSummaryLines.join("\n")}\n\nTotal Amount: ₹${total}\n\nPlease confirm availability and delivery status in Akola!`;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = `https://wa.me/${storeSettings?.whatsappNumber || "919765013112"}?text=${encodeURIComponent(whatsappMessage)}`;
  const zomatoUrl = storeSettings?.zomatoUrl || "https://www.zomato.com/akola/the-hidden-bakers-new-radhakisan-plots";
  const swiggyUrl = storeSettings?.swiggyUrl || "https://www.swiggy.com/search?query=The%20Hidden%20Bakers";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[var(--accent-primary)]" />
              <h3 className="font-serif-heading font-bold text-lg text-[var(--text-primary)]">
                Home Delivery Order Options
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto text-xs">
            {/* Informational Banner */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-[var(--text-secondary)]">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <b>Delivery Handoff Notice:</b> Swiggy and Zomato don't support automatic 3rd-party cart injection. Use <b>WhatsApp</b> for instant automatic order sending, or <b>copy your summary</b> to quickly select items on Swiggy/Zomato.
              </p>
            </div>

            {/* Selected Items Summary Box */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[11px]">
                  Selected Items ({items.length})
                </span>
                <span className="font-extrabold text-[var(--accent-primary)] text-sm">
                  Total: ₹{total}
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[var(--text-secondary)]">
                    <span>
                      <strong className="text-[var(--text-primary)]">{item.quantity}x</strong> {item.name}
                      {item.size && <span className="text-[10px] text-[var(--text-muted)] ml-1">({item.size})</span>}
                    </span>
                    <span className="font-bold text-[var(--text-primary)]">₹{item.price}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCopySummary}
                className="w-full py-2 px-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold flex items-center justify-center gap-2 hover:border-[var(--accent-primary)] transition-all shadow-2xs active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600 font-extrabold">Order Summary Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Copy Order Summary to Clipboard</span>
                  </>
                )}
              </button>
            </div>

            {/* OPTION B: WhatsApp Order (RECOMMENDED & AUTOMATIC) */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" /> Option B (Recommended — Automatic)
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                  ⚡ Pre-filled Chat
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Sends your exact order items directly into a pre-filled WhatsApp chat with The Hidden Bakers staff!
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]">
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" /> Send Order via WhatsApp
                </Button>
              </a>
            </div>

            {/* OPTION A: Swiggy / Zomato Manual Handoff */}
            <div className="space-y-2.5 pt-1 border-t border-[var(--border-color)]">
              <span className="font-extrabold text-[var(--text-primary)] uppercase tracking-wider text-[11px] block">
                Option A: Continue on Delivery Platforms
              </span>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Open the bakery listing below, then search for your copied items to complete delivery checkout:
              </p>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={zomatoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#CB202D] hover:bg-[#b01b26] text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs shadow-2xs"
                >
                  Open Zomato <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={swiggyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#FC8019] hover:bg-[#e07014] text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs shadow-2xs"
                >
                  Open Swiggy <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
