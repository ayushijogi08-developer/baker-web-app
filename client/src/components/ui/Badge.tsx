import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "eggless" | "special" | "sale" | "accent";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--border-color)]",
    eggless: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40 border border-emerald-300",
    special: "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/40 border border-amber-300",
    sale: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/40 border border-rose-300",
    accent: "bg-[var(--accent-primary)] text-white"
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
};
