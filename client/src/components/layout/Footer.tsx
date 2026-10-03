import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Mail, Heart, ShieldCheck, QrCode, Banknote, Store, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";

export const Footer: React.FC = () => {
  const { storeSettings } = useCart();

  const footerLinks = [
    { name: "Home", path: "/" },
    { name: "Full Menu & Price List", path: "/menu" },
    { name: "Our Story & Promise", path: "/about" },
    { name: "Contact & Map Directions", path: "/contact" }
  ];

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[var(--border-color)]">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center font-serif-heading font-extrabold text-lg shadow-sm">
                HB
              </div>
              <span className="font-serif-heading text-xl font-bold text-[var(--text-primary)]">
                {storeSettings?.storeName || "The Hidden Bakers"}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Akola's premier bakery for handcrafted Belgian chocolate cakes, eggless gourmet pastries, sourdough breads, and savory treats.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Hygienic • Daily Fresh Bakes</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif-heading font-bold text-base text-[var(--text-primary)] mb-4">
              Explore Our Bakery
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="inline-block relative hover:text-[var(--accent-primary)] transition-colors group py-0.5"
                  >
                    <span>{link.name}</span>
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"
                    />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/track-order"
                  className="hover:text-[var(--accent-primary)] transition-colors font-bold text-[var(--accent-primary)] flex items-center gap-1.5 pt-1"
                >
                  <Search className="w-3.5 h-3.5" /> Track Live Order Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif-heading font-bold text-base text-[var(--text-primary)] mb-4">
              Visit Store in Akola
            </h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span>{storeSettings?.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                <a href={`tel:${storeSettings?.phone?.replace(/\s+/g, "")}`} className="hover:text-[var(--accent-primary)] transition-colors font-medium">
                  {storeSettings?.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                <span>{storeSettings?.email}</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours & Payment Methods */}
          <div>
            <div className="space-y-3">
              <div className="bg-[var(--bg-card)] p-3.5 rounded-xl border border-[var(--border-color)] space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
                  <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Open Everyday</span>
                </div>
                <p className="text-[var(--text-secondary)] pl-6">
                  {storeSettings?.openingHours}
                </p>
              </div>


            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} {storeSettings?.storeName || "The Hidden Bakers"}, Akola. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Handcrafted with</span>
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </motion.div>
            <span>for cake lovers in Maharashtra.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
