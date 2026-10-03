import React from "react";
import { ExternalLink } from "lucide-react";
import { useCart } from "../../context/CartContext";

export interface PlatformDeliveryButtonsProps {
  variant?: "default" | "compact" | "cards" | "inline";
  size?: "sm" | "md" | "lg";
  className?: string;
  showTitle?: boolean;
}

export const PlatformDeliveryButtons: React.FC<PlatformDeliveryButtonsProps> = ({
  variant = "default",
  size = "md",
  className = "",
  showTitle = true,
}) => {
  const { storeSettings } = useCart();

  const zomatoUrl =
    storeSettings?.zomatoUrl ||
    "https://www.zomato.com/akola/the-hidden-bakers-new-radhakisan-plots";
  const swiggyUrl =
    storeSettings?.swiggyUrl ||
    "https://www.swiggy.com/search?query=The%20Hidden%20Bakers";

  // Zomato Brand Icon SVG
  const ZomatoIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.35 1.76-1.57 4.29-3.64 7.6-.28.45-.63.48-.84.48-.21 0-.56-.03-.84-.48-2.07-3.31-3.29-5.84-3.64-7.6-.42-2.12 1.15-3.8 3.23-3.8 1.05 0 1.95.42 2.5 1.15.55-.73 1.45-1.15 2.5-1.15 2.08 0 3.65 1.68 3.23 3.8zm-4.64 3.7c.69-1.24 1.34-2.3 1.75-3.15.22-.45.15-.95-.25-1.15-.36-.18-.84-.04-1.07.31-.38.58-.87 1.33-1.43 2.19-.56-.86-1.05-1.61-1.43-2.19-.23-.35-.71-.49-1.07-.31-.4.2-.47.7-.25 1.15.41.85 1.06 1.91 1.75 3.15z" />
    </svg>
  );

  // Swiggy Brand Icon SVG
  const SwiggyIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.47 2 2 6.47 2 12c0 4.14 2.8 7.62 6.64 8.65.17.05.36-.08.36-.26V17.9c0-.44.25-.83.64-1.01l.08-.04c.82-.41 1.28-1.3 1.13-2.2-.13-.77-.73-1.4-1.5-1.58C8.25 12.82 7.5 13.62 7.5 14.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-1.43 1.19-2.6 2.64-2.5 1.25.09 2.26 1.05 2.42 2.3.19 1.43-.53 2.76-1.78 3.44l-.08.04c-.07.03-.1.1-.1.17v2.09c0 .61.57 1.07 1.17.93C16.29 20.35 20 16.6 20 12c0-5.53-4.47-10-10-10zm.5 4c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z" />
    </svg>
  );

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-xl",
    md: "px-4 py-2.5 text-xs sm:text-sm rounded-xl sm:rounded-2xl",
    lg: "px-5 py-3.5 text-sm sm:text-base rounded-2xl",
  };

  if (variant === "cards") {
    return (
      <div className={`space-y-3 ${className}`}>
        {showTitle && (
          <div className="text-center sm:text-left space-y-1">
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#FC8019] block">
              Instant Doorstep Delivery in Akola
            </span>
            <h4 className="font-serif-heading font-extrabold text-lg text-[var(--text-primary)]">
              Order Online via Swiggy
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Craving fresh cakes & treats delivered in 30-45 minutes? Click below to view our live store listing on Swiggy!
            </p>
          </div>
        )}
        <div>
          {/* Swiggy Card Button */}
          <a
            href={swiggyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden bg-gradient-to-r from-[#FC8019] to-[#F47E00] text-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border border-orange-500/30 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <SwiggyIcon />
              </div>
              <div>
                <span className="font-extrabold text-sm block leading-tight">Order on Swiggy</span>
                <span className="text-[11px] text-white/80 font-medium">Fast Local Doorstep Delivery</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-[#FC8019] flex items-center justify-center transition-all shrink-0">
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Swiggy Button */}
      <a
        href={swiggyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group inline-flex items-center justify-center gap-2 font-extrabold text-white bg-[#FC8019] hover:bg-[#e06d0b] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg border border-orange-600/40 cursor-pointer ${sizeClasses[size]}`}
        title="Open The Hidden Bakers listing on Swiggy"
      >
        <SwiggyIcon />
        <span>Order on Swiggy</span>
        <ExternalLink className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </div>
  );
};
