import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Clock, Cake, MapPin, Phone, Heart, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { Product, Category } from "../types";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/Button";
import { ProductCard } from "../components/ui/ProductCard";
import { CategoryCard } from "../components/ui/CategoryCard";
import { MarqueeTicker } from "../components/ui/MarqueeTicker";
import { ProductSlider } from "../components/ui/ProductSlider";
import { TestimonialSlider } from "../components/ui/TestimonialSlider";
import { heroSequenceVariants, staggerContainerVariants, staggerItemVariants, fadeInUpVariants } from "../utils/animationUtils";

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { storeSettings, activeCoupons, applyCoupon, setIsCartDrawerOpen } = useCart();

  const [copiedCodeToast, setCopiedCodeToast] = useState<boolean>(false);
  const [copiedCodeText, setCopiedCodeText] = useState<string>("");

  const heroCoupon = activeCoupons.length > 0 ? activeCoupons[0] : null;

  const handleCopyCoupon = async (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("Clipboard error", err);
    }
    setCopiedCodeText(code);
    setCopiedCodeToast(true);
    await applyCoupon(code);
    setIsCartDrawerOpen(true);
    setTimeout(() => setCopiedCodeToast(false), 2200);
  };

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products?featured=true"),
          api.get("/categories")
        ]);
        setFeaturedProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Error loading homepage data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Restore exact scroll position or scroll to target product card when returning from product detail page
  useEffect(() => {
    if (!loading && featuredProducts.length > 0) {
      const savedY = sessionStorage.getItem("thb_menu_scroll_y");
      const lastProdId = sessionStorage.getItem("thb_last_product_id");

      if (lastProdId || savedY !== null) {
        const timer = setTimeout(() => {
          if (lastProdId) {
            const el = document.getElementById(`product-card-${lastProdId}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              sessionStorage.removeItem("thb_menu_scroll_y");
              sessionStorage.removeItem("thb_last_product_id");
              return;
            }
          }
          if (savedY !== null) {
            const posY = parseInt(savedY, 10);
            window.scrollTo({ top: posY, behavior: "smooth" });
            sessionStorage.removeItem("thb_menu_scroll_y");
            sessionStorage.removeItem("thb_last_product_id");
          }
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [loading, featuredProducts.length]);

  return (
    <div className="relative">
      {/* Toast Notification when Coupon Code is Copied */}
      <AnimatePresence>
        {copiedCodeToast && (
          <motion.div
            key="home-copied-toast-pill"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-2xl border border-amber-400/40 flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Copied code <b>{copiedCodeText}</b>! Auto-applied to cart.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[var(--bg-secondary)]/50 via-[var(--bg-primary)] to-[var(--bg-primary)]">
        {/* Floating Decorative Elements */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 left-10 text-amber-500/30 pointer-events-none hidden sm:block"
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-16 text-amber-500/20 pointer-events-none hidden sm:block"
        >
          <Cake className="w-12 h-12" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-6 text-center lg:text-left"
            >
              <motion.div variants={heroSequenceVariants.badge}>
                <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 px-3.5 sm:px-4 py-2 rounded-2xl sm:rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold shadow-sm backdrop-blur-md">
                  <span className="flex items-center gap-1 text-[var(--accent-primary)] font-extrabold">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Fresh Bakes & Gourmet Treats</span>
                  </span>
                  {heroCoupon && (
                    <>
                      <span className="text-[var(--text-muted)] hidden sm:inline">•</span>
                      <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <span>Use code</span>
                        <button
                          onClick={(e) => handleCopyCoupon(e, heroCoupon.code)}
                          className="px-2 py-0.5 rounded-md bg-[var(--accent-primary)] text-white font-extrabold tracking-wider hover:bg-[var(--accent-hover)] transition-all cursor-pointer shadow-2xs flex items-center gap-1 text-[11px]"
                          title={`Click to copy & apply code ${heroCoupon.code}`}
                        >
                          <span>{heroCoupon.code}</span>
                          <Copy className="w-3 h-3" />
                        </button>
                        <span className="font-extrabold text-[var(--text-primary)]">
                          {heroCoupon.type === "PERCENT" ? `${heroCoupon.value}% OFF` : `₹${heroCoupon.value} OFF`}
                        </span>
                      </span>
                    </>
                  )}
                </div>
              </motion.div>

              <motion.h1
                variants={heroSequenceVariants.headline}
                className="font-serif-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] leading-[1.15] tracking-tight"
              >
                Freshly Baked. <br />
                <span className="text-[var(--accent-primary)] italic">Made With Love.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={heroSequenceVariants.subtext}
                className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
              >
                Discover freshly baked Belgian chocolate cakes, gourmet eggless pastries, artisanal sourdough breads, and savory snacks from <strong className="text-[var(--text-primary)]">{storeSettings?.storeName || "The Hidden Bakers"}</strong>.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={heroSequenceVariants.cta}
                className="space-y-4 pt-2"
              >
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <Link to="/menu">
                    <Button variant="primary" size="lg" className="shadow-lg group font-bold">
                      Explore Menu & Pickup{" "}
                      <motion.span
                        className="inline-block ml-1"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.span>
                    </Button>
                  </Link>
                  <Link to="/track-order">
                    <Button variant="secondary" size="lg">
                      Track Pickup Order
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Stats Badges */}
              <motion.div
                variants={heroSequenceVariants.stats}
                className="pt-6 grid grid-cols-3 gap-4 border-t border-[var(--border-color)] max-w-md mx-auto lg:mx-0 text-left"
              >
                <div>
                  <p className="font-serif-heading font-extrabold text-xl text-[var(--text-primary)]">100%</p>
                  <p className="text-xs text-[var(--text-muted)]">Fresh Daily</p>
                </div>
                <div>
                  <p className="font-serif-heading font-extrabold text-xl text-[var(--text-primary)]">Belgian</p>
                  <p className="text-xs text-[var(--text-muted)]">Chocolate</p>
                </div>
                <div>
                  <p className="font-serif-heading font-extrabold text-xl text-[var(--text-primary)]">4.9 ★</p>
                  <p className="text-xs text-[var(--text-muted)]">Customer Rating</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Hero Image Composition with Continuous Idle Float */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroSequenceVariants.image}
              className="relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Image Frame with Subtle Float Animation */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                  className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-[var(--bg-card)]"
                >
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80"
                    alt="Belgian Truffle Cake"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>

                {/* Floating "Custom Celebration Cakes" Card */}
                <motion.div
                  variants={heroSequenceVariants.floatingCards}
                  whileHover={{ scale: 1.04, y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute top-3 left-3 sm:top-auto sm:-bottom-6 sm:-left-4 lg:left-6 bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-2.5 sm:gap-3 cursor-pointer z-10 max-w-[170px] sm:max-w-none"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold shrink-0">
                    <Cake className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-[11px] sm:text-xs text-[var(--text-primary)] leading-tight">Custom Celebration Cakes</p>
                    <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] leading-tight hidden sm:block">Baked fresh to order</p>
                  </div>
                </motion.div>

                {/* Floating "100% Eggless Options" Badge */}
                <motion.div
                  variants={heroSequenceVariants.floatingCards}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute top-3 right-3 sm:top-auto sm:-top-4 sm:-right-4 bg-emerald-600/95 backdrop-blur-md text-white px-3 py-2 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-1.5 sm:gap-2 cursor-pointer z-10"
                >
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-extrabold whitespace-nowrap">100% Eggless Options</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INFINITELY SCROLLING MARQUEE TICKER */}
      <MarqueeTicker />

      {/* QUICK CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              Curated Collections
            </span>
            <h2 className="font-serif-heading font-extrabold text-3xl text-[var(--text-primary)] mt-1">
              Explore Our Bakery Categories
            </h2>
          </div>
          <Link to="/menu" className="text-sm font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1 group">
            View All Categories{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-[var(--bg-secondary)] animate-pulse border border-[var(--border-color)]" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </motion.div>
        )}
      </section>

      {/* FEATURED BESTSELLERS CAROUSEL SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUpVariants}
        >
          <ProductSlider
            subtitle="Customer Favorites"
            title="Akola's Most Loved Bakes Carousel"
            products={featuredProducts}
          />
        </motion.div>
      </section>

      {/* CUSTOMER TESTIMONIALS SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUpVariants}
        >
          <TestimonialSlider />
        </motion.div>
      </section>

      {/* LOCATION SHOWCASE - SCROLL REVEAL */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUpVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 md:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              Store Location & Contact
            </span>
            <h2 className="font-serif-heading font-extrabold text-3xl text-[var(--text-primary)]">
              Visit Our Bakery Counter in Akola
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Located conveniently infront of LRT College on Necklace Road, <strong>{storeSettings?.storeName}</strong> is your local destination for fresh morning loaves, celebration cakes, and delicious evening snacks.
            </p>

            <div className="space-y-3 pt-2 text-xs text-[var(--text-primary)] font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span>{storeSettings?.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                <span>{storeSettings?.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                <span>Open Everyday: {storeSettings?.openingHours}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <a href={`tel:${storeSettings?.phone?.replace(/\s+/g, "")}`}>
                <Button variant="primary" size="md">
                  <Phone className="w-4 h-4 mr-1" /> Call Store Counter
                </Button>
              </a>
            </div>
          </div>

          <div className="aspect-4/3 rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-md">
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
              alt="Freshly baked breads"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </motion.section>
    </div>
  );
};
