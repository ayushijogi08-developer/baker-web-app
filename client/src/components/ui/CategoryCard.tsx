import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Category } from "../../types";

export const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  return (
    <Link to={`/menu?category=${category.slug}`} className="block">
      <motion.div
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-[var(--border-color)] bg-[var(--bg-card)] cursor-pointer"
      >
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out brightness-[0.85] dark:brightness-[0.65] group-hover:brightness-[0.95]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-700 to-amber-950" />
        )}

        {/* Gradient overlay that deepens slightly on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent group-hover:from-black/90 transition-colors duration-300" />

        <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] uppercase font-extrabold tracking-wider bg-amber-500/90 text-white mb-1.5 shadow-xs">
                {category._count?.products || 6}+ Items
              </span>
              <h3 className="font-serif-heading text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-amber-100/80 line-clamp-1 mt-0.5 font-normal">
                {category.description}
              </p>
            </div>

            {/* Arrow Circle with hover nudge and rotate */}
            <motion.div
              whileHover={{ rotate: 12 }}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[var(--accent-primary)] group-hover:scale-110 transition-all duration-300 shrink-0"
            >
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
