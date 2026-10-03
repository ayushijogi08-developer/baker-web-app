import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, ShoppingBag, Menu as MenuIcon, X, Sparkles, Shield, Clock, Copy, Ticket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { getStoreOpenStatus } from "../../utils/storeTiming";

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { totalItemCount, setIsCartDrawerOpen, storeSettings, activeCoupons, applyCoupon, cartBounceKey } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");
  const location = useLocation();

  const storeTiming = getStoreOpenStatus(storeSettings);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (activeCoupons.length <= 1) return;
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % activeCoupons.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeCoupons]);

  const handleQuickApplyCoupon = async (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("Clipboard error", err);
    }
    setCopiedCode(code);
    setCopiedToast(true);
    await applyCoupon(code);
    setIsCartDrawerOpen(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Track Order", path: "/track-order" },
    { name: "About Bakery", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const currentCoupon = activeCoupons.length > 0 ? activeCoupons[bannerIndex % activeCoupons.length] : null;

  return (
    <header className="sticky top-0 z-30 transition-all duration-300">
      {/* Toast Notification when Coupon Code is Copied */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            key="header-copied-toast-pill"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-2xl border border-amber-400/40 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Copied code <b>{copiedCode}</b>! Auto-applied to cart.</span>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Store Closed Operating Hours Banner */}
      {!storeTiming.isOpen && (
        <div className="bg-[var(--accent-primary)] text-white text-[11px] sm:text-xs font-extrabold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-xs border-b border-amber-900/20">
          <Clock className="w-3.5 h-3.5 animate-pulse shrink-0" />
          <span>{storeTiming.notice}</span>
        </div>
      )}

      {/* Main Navbar */}
      <motion.nav
        animate={{
          height: isScrolled ? "4rem" : "4.75rem",
          backgroundColor: isScrolled ? "var(--nav-bg)" : "var(--bg-primary)",
        }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
        className={`w-full border-b backdrop-blur-md flex items-center ${
          isScrolled
            ? "border-[var(--border-color)] shadow-sm"
            : "border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand Lockup */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[var(--accent-primary)] text-white flex items-center justify-center font-serif-heading font-extrabold text-lg sm:text-xl shadow-md shrink-0"
            >
              HB
            </motion.div>
            <div className="flex flex-col">
              <span className="font-serif-heading text-sm sm:text-xl font-extrabold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors whitespace-nowrap leading-snug sm:leading-normal">
                {storeSettings?.storeName || "The Hidden Bakers"}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] whitespace-nowrap leading-none mt-0.5">
                Akola • Necklace Road
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const isHovered = hoveredNav === link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onMouseEnter={() => setHoveredNav(link.path)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className={`text-sm font-semibold transition-colors relative py-1.5 ${
                    isActive
                      ? "text-[var(--accent-primary)] font-bold"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {link.name}

                  {/* Active Indicator Underline */}
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Animated Hover Underline (when not active) */}
                  {!isActive && isHovered && (
                    <motion.span
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      exit={{ scaleX: 0, opacity: 0 }}
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--text-muted)]/50 rounded-full origin-left"
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icon Buttons (Shield, Theme, Cart, Hamburger) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Admin Portal Button (Desktop Only — on mobile available in menu) */}
            <Link to="/admin" className="hidden sm:block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
                title="Admin Portal"
              >
                <Shield className="w-4.5 h-4.5" />
              </motion.div>
            </Link>

            {/* Theme Switcher Toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer flex items-center justify-center shadow-2xs relative overflow-hidden"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {theme === "light" ? (
                    <Moon className="w-4.5 h-4.5 text-amber-950" />
                  ) : (
                    <Sun className="w-4.5 h-4.5 text-amber-400" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Cart Drawer Trigger */}
            <motion.button
              id="header-cart-icon"
              key={cartBounceKey}
              animate={cartBounceKey > 0 ? { scale: [1, 1.25, 0.92, 1.1, 1], rotate: [0, -8, 8, -4, 0] } : {}}
              transition={{ duration: 0.45, ease: "easeOut" }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] transition-colors cursor-pointer shadow-xs flex items-center justify-center"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <AnimatePresence>
                {totalItemCount > 0 && (
                  <motion.span
                    key={`header-badge-${totalItemCount}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[var(--bg-primary)] shadow-xs z-20"
                  >
                    {totalItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center justify-center shadow-2xs"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="header-mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="md:hidden bg-[var(--bg-card)] border-b border-[var(--border-color)] px-4 py-6 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col gap-4 mb-2">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 + 0.05, duration: 0.2 }}
                >
                  <Link
                    to={link.path}
                    className={`text-base font-bold py-2 border-b border-[var(--border-color)] flex items-center justify-between ${
                      location.pathname === link.path
                        ? "text-[var(--accent-primary)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.2 }}
              >
                <Link
                  to="/admin"
                  className="text-xs font-bold py-2 text-[var(--accent-primary)] flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" /> Admin Portal Login
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
