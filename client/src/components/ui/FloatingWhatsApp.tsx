import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { storeSettings } = useCart();

  const whatsappNumber = storeSettings?.whatsappNumber || "919765013112";
  const defaultMessage = `Hello ${storeSettings?.storeName || "The Hidden Bakers"}! I would like to inquire about fresh cakes and pastries available today in Akola.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="whatsapp-chat-box-panel"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl shadow-2xl max-w-xs w-72"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)] mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {storeSettings?.storeName || "The Hidden Bakers"}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
              Hi there! 👋 Need custom cake pricing, party orders, or fast delivery in Akola? Chat directly with our bakery counter!
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" /> Start WhatsApp Chat
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-center">
        {/* Subtle Ambient Pulse Ring */}
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-emerald-500/40 pointer-events-none"
        />

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-2xl relative group cursor-pointer"
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute right-16 bg-[#2A1810] text-white text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
            Chat on WhatsApp
          </span>
        </motion.button>
      </div>
    </div>
  );
};
