import React from "react";
import { MapPin, Phone, ShieldCheck, Clock, Sparkles, Cake, Heart, Award, Flame, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { fadeInUpVariants, staggerContainerVariants, staggerItemVariants } from "../utils/animationUtils";

export const About: React.FC = () => {
  const { storeSettings } = useCart();

  const bakeryPillars = [
    {
      icon: Cake,
      title: "100% Eggless Options",
      desc: "Pure vegetarian baking standards available across our entire range of cakes, slices, and pastries.",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    },
    {
      icon: Flame,
      title: "Daily Fresh Batch",
      desc: "No pre-made frozen stock. Sponges, ganaches, and sourdough loaves are baked fresh every morning.",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    },
    {
      icon: Award,
      title: "Real Belgian Dark Chocolate",
      desc: "We exclusively import high-cocoa Belgian chocolate for all truffle cakes and chocolate ganaches.",
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    },
    {
      icon: Heart,
      title: "Handcrafted in Akola",
      desc: "Locally owned & family-run bakery counter operating with love on Necklace Road in front of LRT College.",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    },
  ];

  const bakeryProcessSteps = [
    { step: "01", title: "Midnight Fermentation", desc: "36-hour slow fermentation of artisanal sourdough sourdough starter." },
    { step: "02", title: "Belgian Ganache Crafting", desc: "Melting rich cocoa couverture for our signature truffle frostings." },
    { step: "03", title: "Morning Counter Bake", desc: "Ovens heat up at 6:00 AM for fresh morning loaves and party cakes." },
    { step: "04", title: "Express Akola Delivery", desc: "Hand-packed in insulated boxes and dispatched right to your door." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 overflow-hidden">
      {/* Editorial Header Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants(0.1, 0.05)}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <motion.div variants={staggerItemVariants}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-light)] text-[var(--accent-primary)] text-xs font-bold uppercase tracking-wider border border-[var(--border-color)] shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Our Story & Bakery Identity</span>
          </div>
        </motion.div>

        <motion.h1
          variants={staggerItemVariants}
          className="font-serif-heading font-extrabold text-4xl sm:text-5xl text-[var(--text-primary)]"
        >
          {storeSettings?.storeName || "The Hidden Bakers"}
        </motion.h1>

        <motion.p
          variants={staggerItemVariants}
          className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal"
        >
          Crafting freshly baked artisanal cakes, Belgian chocolate pastries, wholesome sourdough loaves, and traditional savories right in the heart of Akola, Maharashtra.
        </motion.p>
      </motion.div>

      {/* Main Craftsmanship Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Text & Pillar Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUpVariants}
          className="space-y-6"
        >
          <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight">
            Freshly Baked Every Morning with Premium Ingredients
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            At <strong>{storeSettings?.storeName}</strong>, we believe that exceptional baking starts with uncompromising quality. Located conveniently infront of LRT College on Necklace Road, our bakery counter serves fresh, aromatic bakes prepared daily.
          </p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            From our 100% Belgian chocolate truffle cakes to our slow-fermented sourdough loaves and flaky paneer puffs, every item is crafted with care, hygiene, and passion.
          </p>

          {/* Interactive 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {bakeryPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs space-y-2 cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${pillar.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">{pillar.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Craftsmanship Image with Floating Badge & Subtle Float */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUpVariants}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="aspect-4/3 rounded-3xl overflow-hidden border-4 border-[var(--bg-card)] shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=1000&q=80"
              alt="Pastry craftsmanship"
              className="w-full h-full object-cover hover:scale-106 transition-transform duration-700 ease-out"
            />
          </motion.div>

          {/* Floating Artisan Quality Seal */}
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            className="absolute -bottom-6 -left-4 bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-[var(--text-primary)]">Artisanal Quality Guaranteed</p>
              <p className="text-[11px] text-[var(--text-muted)]">Akola's trusted bakery counter</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* BAKERY PROCESS TIMELINE */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUpVariants}
        className="space-y-8"
      >
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
            How We Bake
          </span>
          <h2 className="font-serif-heading font-extrabold text-3xl text-[var(--text-primary)]">
            Our Daily Kitchen Process
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bakeryProcessSteps.map((ps, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs relative overflow-hidden group cursor-pointer"
            >
              <span className="text-4xl font-serif-heading font-black text-[var(--accent-primary)]/20 group-hover:text-[var(--accent-primary)]/40 transition-colors block mb-2">
                {ps.step}
              </span>
              <h3 className="font-bold text-base text-[var(--text-primary)] mb-1">
                {ps.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {ps.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* OFFICIAL STORE INFO CARD WITH ANIMATED ENTRANCE */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUpVariants}
        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 md:p-12 shadow-sm space-y-6 max-w-4xl mx-auto"
      >
        <h3 className="font-serif-heading font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] text-center">
          Official Store Info & Address
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[var(--text-secondary)] pt-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--text-primary)] block font-bold">Full Address:</strong>
                <span>{storeSettings?.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
              <div>
                <strong className="text-[var(--text-primary)] block font-bold">Phone Number:</strong>
                <a href={`tel:${storeSettings?.phone?.replace(/\s+/g, "")}`} className="hover:text-[var(--accent-primary)] font-semibold transition-colors">
                  {storeSettings?.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--text-primary)] block font-bold">Opening Hours:</strong>
                <span>{storeSettings?.openingHours}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--text-primary)] block font-bold">Service Area:</strong>
                <span>Akola city local delivery & store counter pickup</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
