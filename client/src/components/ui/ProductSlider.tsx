import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "../../types";
import { ProductCard } from "./ProductCard";

interface ProductSliderProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({ products, title, subtitle }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!products || products.length === 0) return null;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    const itemWidth = 304; // 280px card + 24px gap
    const newIndex = Math.round(scrollPosition / itemWidth);
    setActiveIndex(Math.min(products.length - 1, Math.max(0, newIndex)));
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -304 : 304;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const scrollToIdx = (idx: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: idx * 304, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Slider Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {subtitle && (
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="font-serif-heading font-extrabold text-3xl text-[var(--text-primary)] mt-1">
              {title}
            </h2>
          )}
        </div>

        {/* Arrow Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors flex items-center justify-center shadow-xs cursor-pointer z-10"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors flex items-center justify-center shadow-xs cursor-pointer z-10"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Native Finger Touch & Scroll Track */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory touch-pan-x p-1 -m-1 no-scrollbar sm:[&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="w-[280px] shrink-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Indicator Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIdx(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              activeIndex === idx
                ? "w-6 bg-[var(--accent-primary)]"
                : "w-2 bg-[var(--border-color)] hover:bg-[var(--text-muted)]"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
