import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Leaf, Cake, Award, Truck, Heart } from "lucide-react";

export const MarqueeTicker: React.FC = () => {
  const items = [
    { icon: Cake, text: "Belgian Truffle Cakes" },
    { icon: Leaf, text: "100% Eggless Gourmet Options" },
    { icon: Award, text: "Artisanal Sourdough & Garlic Breads" },
    { icon: Truck, text: "Free Delivery over ₹500 in Akola" },
    { icon: Sparkles, text: "Custom Celebration Cakes Baked Fresh" },
    { icon: Heart, text: "Handcrafted With Love Daily" },
  ];

  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-[var(--accent-primary)] via-amber-600 to-[var(--accent-primary)] text-white py-3.5 border-y border-amber-400/30 shadow-md">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex items-center gap-8 whitespace-nowrap"
      >
        {duplicatedItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-extrabold tracking-wide uppercase">
              <Icon className="w-4 h-4 text-amber-200 shrink-0 animate-pulse" />
              <span>{item.text}</span>
              <span className="text-amber-300 ml-4">•</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
