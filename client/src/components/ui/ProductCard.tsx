import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag, Leaf, Check, Ban, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./Badge";
import { useCart } from "../../context/CartContext";
import { Product } from "../../types";

import { getStoreOpenStatus } from "../../utils/storeTiming";
import { formatPortionLabel } from "../../utils/formatters";

const DEFAULT_BAKERY_IMAGE = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80";

interface FlyParticle {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  imgSrc: string;
}

interface SparkleBurst {
  id: number;
  x: number;
  y: number;
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, triggerCartBounce, storeSettings } = useCart();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [flyingParticles, setFlyingParticles] = useState<FlyParticle[]>([]);
  const [sparkleBursts, setSparkleBursts] = useState<SparkleBurst[]>([]);

  const isOutOfStock = product.stockStatus === "OUT_OF_STOCK" || product.isOutOfStock === true || (product.stockQuantity !== undefined && product.stockQuantity <= 0);
  const storeTiming = getStoreOpenStatus(storeSettings);
  const isStoreClosed = !storeTiming.isOpen;
  const isActionDisabled = isOutOfStock || isStoreClosed;

  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const effectiveBasePrice = hasDiscount ? (product.discountPrice as number) : product.price;

  const currentSizeObj = product.sizes && product.sizes[selectedSizeIndex];
  const sizePrice = (currentSizeObj && currentSizeObj.priceOverride && currentSizeObj.priceOverride !== product.price)
    ? currentSizeObj.priceOverride
    : effectiveBasePrice;

  const selectedSize = {
    label: currentSizeObj?.label || "Standard",
    price: sizePrice
  };

  const rawImg = product.images && product.images[0];
  const imgSrc = typeof rawImg === "string" ? rawImg : (rawImg?.url || DEFAULT_BAKERY_IMAGE);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isActionDisabled) return;

    // Trigger Sparkle Burst
    const burstId = Date.now();
    setSparkleBursts((prev) => [...prev, { id: burstId, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setSparkleBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 600);

    // Trigger Fly-to-Cart Particle Animation
    const btnRect = e.currentTarget.getBoundingClientRect();
    const cartIconEl = document.getElementById("header-cart-icon");

    if (cartIconEl) {
      const cartRect = cartIconEl.getBoundingClientRect();
      const particle: FlyParticle = {
        id: Date.now() + Math.random(),
        startX: btnRect.left + btnRect.width / 2 - 16,
        startY: btnRect.top + btnRect.height / 2 - 16,
        targetX: cartRect.left + cartRect.width / 2 - 16,
        targetY: cartRect.top + cartRect.height / 2 - 16,
        imgSrc,
      };

      setFlyingParticles((prev) => [...prev, particle]);
    } else {
      triggerCartBounce();
    }

    addToCart(product, selectedSize, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <>
      {/* Fly-to-Cart Particles Portal Overlay */}
      <AnimatePresence>
        {flyingParticles.map((particle, idx) => (
          <motion.div
            key={particle.id || `particle-${idx}`}
            initial={{
              position: "fixed",
              left: particle.startX,
              top: particle.startY,
              width: 36,
              height: 36,
              opacity: 1,
              scale: 1,
              zIndex: 9999,
              pointerEvents: "none",
            }}
            animate={{
              left: particle.targetX,
              top: particle.targetY,
              width: 20,
              height: 20,
              opacity: 0.8,
              scale: 0.5,
            }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => {
              triggerCartBounce();
              setFlyingParticles((prev) => prev.filter((p) => p.id !== particle.id));
            }}
            className="rounded-full overflow-hidden border-2 border-amber-500 shadow-2xl bg-white"
          >
            <img src={particle.imgSrc} alt="" className="w-full h-full object-cover" />
          </motion.div>
        ))}

        {/* Sparkle Burst Click Feedback Particles */}
        {sparkleBursts.map((burst, idx) => (
          <motion.div
            key={burst.id || `burst-${idx}`}
            initial={{ position: "fixed", left: burst.x - 12, top: burst.y - 12, opacity: 1, scale: 0.5, zIndex: 9999, pointerEvents: "none" }}
            animate={{ scale: [0.5, 1.8, 0], opacity: [1, 0.8, 0], rotate: 45 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-amber-500"
          >
            <Sparkles className="w-6 h-6 fill-amber-400" />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        id={`product-card-${product.id}`}
        onClick={() => {
          try {
            sessionStorage.setItem("thb_menu_scroll_y", String(window.scrollY));
            sessionStorage.setItem("thb_last_product_id", product.id);
          } catch (e) {}
        }}
        whileHover={{ y: -6, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="group relative bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
      >
        {/* Product Image Frame */}
        <Link
          to={`/product/${product.slug}`}
          onClick={() => {
            try {
              sessionStorage.setItem("thb_menu_scroll_y", String(window.scrollY));
              sessionStorage.setItem("thb_last_product_id", product.id);
            } catch (e) {}
          }}
          className="relative aspect-4/3 overflow-hidden bg-[var(--bg-secondary)] block"
        >
          <img
            src={imgSrc}
            alt={product.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = DEFAULT_BAKERY_IMAGE;
            }}
            className={`w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out ${
              isOutOfStock ? "opacity-70 grayscale-[20%]" : ""
            }`}
          />

          {/* High-Visibility Image Overlay Badges */}
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1 pointer-events-none">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black shadow-lg">
                <Ban className="w-3 h-3" /> Out of Stock
              </span>
            ) : product.stockQuantity !== undefined && product.stockQuantity > 0 && product.stockQuantity <= 5 ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-xl ring-2 ring-amber-400/50 animate-bounce">
                <Sparkles className="w-3 h-3 text-slate-950" /> Only {product.stockQuantity} Left - Order Quickly!
              </span>
            ) : hasDiscount ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600/95 text-white text-[10px] font-black shadow-md backdrop-blur-xs">
                Save ₹{product.price - (product.discountPrice as number)}
              </span>
            ) : null}
          </div>

          {product.featured && (
            <div className="absolute bottom-2.5 left-2.5 bg-amber-500/90 text-amber-950 px-2.5 py-0.5 rounded-md font-extrabold text-[10px] tracking-wide uppercase shadow-xs">
              Bestseller
            </div>
          )}
        </Link>

        {/* Product Card Details */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
          <div>
            {/* Rating Stars & Count */}
            <div className="flex items-center justify-between text-xs text-amber-500 font-bold mb-1">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating ?? 4.9}</span>
                <span className="text-[var(--text-muted)] text-[11px] font-normal">
                  ({product.reviewCount ?? 95})
                </span>
              </div>
            </div>

            <Link
              to={`/product/${product.slug}`}
              onClick={() => {
                try {
                  sessionStorage.setItem("thb_menu_scroll_y", String(window.scrollY));
                  sessionStorage.setItem("thb_last_product_id", product.id);
                } catch (e) {}
              }}
            >
              <h3 className="font-serif-heading font-extrabold text-base text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>

            {/* Low Stock Order Quickly Urgency Banner */}
            {product.stockQuantity !== undefined && product.stockQuantity > 0 && product.stockQuantity <= 5 && (
              <div className="mt-2 py-1 px-2.5 rounded-lg bg-amber-500/20 dark:bg-amber-950/60 border border-amber-500/50 text-amber-950 dark:text-amber-200 text-[11px] font-black flex items-center gap-1.5 animate-pulse shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Low Stock ({product.stockQuantity} Left) — Order Quickly!</span>
              </div>
            )}
          </div>

          {/* Portion Badge Selector */}
          {(() => {
            const catName = product.category?.name || product.category?.slug || "";
            const isBeverage = catName.toLowerCase().includes("shake") || catName.toLowerCase().includes("drink") || catName.toLowerCase().includes("mocktail") || catName.toLowerCase().includes("beverage") || product.name.toLowerCase().includes("shake") || product.name.toLowerCase().includes("mojito");
            const isIceCream = catName.toLowerCase().includes("dessert") || catName.toLowerCase().includes("ice cream") || product.name.toLowerCase().includes("ice cream") || product.name.toLowerCase().includes("sundae");
            const isCombo = catName.toLowerCase().includes("combo") || product.name.toLowerCase().includes("combo");
            const isFastFood = catName.toLowerCase().includes("snack") || catName.toLowerCase().includes("fry") || catName.toLowerCase().includes("fries") || catName.toLowerCase().includes("munchie") || catName.toLowerCase().includes("savory") || catName.toLowerCase().includes("pizza") || catName.toLowerCase().includes("burger");
            const isPastryOrPiece = catName.toLowerCase().includes("pastr") || catName.toLowerCase().includes("puff") || product.name.toLowerCase().includes("pastry") || product.name.toLowerCase().includes("puff") || product.name.toLowerCase().includes("brownie") || product.name.toLowerCase().includes("slice");

            const defaultLabel = isBeverage ? "Regular" : isIceCream ? "1 Scoop" : isCombo ? "Combo Set" : isFastFood ? "Regular" : isPastryOrPiece ? (product.name.toLowerCase().includes("brownie") ? "1 Pc" : "1 Slice") : "0.5 kg";

            const sizesList = (product.sizes && product.sizes.length > 0)
              ? product.sizes
              : [{ id: "default-sz", label: defaultLabel, priceOverride: effectiveBasePrice }];

            // Hide single redundant portion badge if it's just "Regular", "Standard", "Combo Set" or "1 Portion"
            if (sizesList.length === 1) {
              const singleBadge = formatPortionLabel(sizesList[0].label, catName, product.name);
              const lowerSingle = singleBadge.toLowerCase();
              if (
                lowerSingle === "regular" ||
                lowerSingle === "standard" ||
                lowerSingle === "standard portion" ||
                lowerSingle === "combo set" ||
                lowerSingle === "1 portion"
              ) {
                return null;
              }
            }

            return (
              <div className="flex flex-wrap gap-1.5 relative pt-1">
                {sizesList.map((sz, idx) => {
                  const isSelected = selectedSizeIndex === idx;
                  const displayBadge = formatPortionLabel(sz.label, catName, product.name);

                  return (
                    <button
                      key={sz.id || `size-${sz.label || idx}-${idx}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedSizeIndex(idx);
                      }}
                      disabled={isActionDisabled}
                      className={`relative text-[11px] px-2.5 py-1 rounded-lg font-extrabold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-2xs"
                          : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)]"
                      }`}
                    >
                      <span>{displayBadge}</span>
                    </button>
                  );
                })}
              </div>
            );
          })()}

          {/* Price & Action Row */}
          <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between mt-auto">
            <div>
              <div className="text-xs text-[var(--text-muted)]">Price</div>
              <div className="flex items-baseline gap-1.5">
                <span className={`font-extrabold text-lg ${isOutOfStock ? "text-[var(--text-muted)]" : "text-[var(--accent-primary)]"}`}>
                  ₹{selectedSize.price}
                </span>
                {hasDiscount && selectedSizeIndex === 0 && (
                  <span className="text-xs line-through text-[var(--text-muted)]">
                    ₹{product.price}
                  </span>
                )}
              </div>
            </div>

            <motion.button
              whileTap={isActionDisabled ? {} : { scale: 0.92 }}
              type="button"
              onClick={handleAddToCart}
              disabled={isActionDisabled}
              className={`p-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center cursor-pointer ${
                isActionDisabled
                  ? "bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)] cursor-not-allowed opacity-80"
                  : addedAnimation
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] shadow-xs"
              }`}
              title={isOutOfStock ? "Out of Stock" : isStoreClosed ? storeTiming.notice : "Add to Cart"}
            >
              {isOutOfStock ? (
                <span className="text-xs font-semibold px-1.5 text-[var(--text-muted)]">Out of Stock</span>
              ) : isStoreClosed ? (
                <span className="text-xs font-semibold px-1.5 text-amber-600 dark:text-amber-400">Store Closed</span>
              ) : addedAnimation ? (
                <motion.div
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  className="flex items-center"
                >
                  <Check className="w-4 h-4 mr-1" />
                  <span className="text-xs font-bold">Added</span>
                </motion.div>
              ) : (
                <div className="flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  <span className="text-xs font-bold">Add</span>
                </div>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
