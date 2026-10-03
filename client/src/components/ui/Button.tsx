import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]";

  const variants = {
    primary: "bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white shadow-sm hover:shadow-md focus:ring-[var(--accent-primary)]",
    secondary: "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)]",
    outline: "border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-light)]",
    ghost: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]",
    dark: "bg-[#2A1810] text-white hover:bg-[#3D251A] dark:bg-[#FAF7F2] dark:text-[#2A1810] dark:hover:bg-[#EFE4D6]",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-semibold gap-1.5",
    md: "px-4 py-2.5 text-sm font-semibold gap-2",
    lg: "px-6 py-3.5 text-base font-bold gap-2.5"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
