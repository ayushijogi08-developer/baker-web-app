import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Check, ShoppingBag, Leaf, Star, ShieldCheck, Minus, Plus, Sparkles } from "lucide-react";
import api from "../services/api";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/Button";
import { ProductCard } from "../components/ui/ProductCard";
import { getStoreOpenStatus } from "../utils/storeTiming";
import { formatPortionLabel } from "../utils/formatters";

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, setIsCheckoutModalOpen, storeSettings } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // Synchronously force viewport to top (0,0) before paint when mounting product details
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data);

        // Fetch related items in same category
        if (res.data.categoryId) {
          const allRes = await api.get("/products");
          const filtered = allRes.data.filter(
            (p: Product) => p.categoryId === res.data.categoryId && p.id !== res.data.id
          );
          setRelatedProducts(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching product details", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-12 min-h-[80vh] space-y-6">
        <div className="h-5 w-28 bg-[var(--bg-secondary)] rounded-md animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="aspect-square rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-[var(--bg-secondary)] rounded-md animate-pulse" />
            <div className="h-8 w-3/4 bg-[var(--bg-secondary)] rounded-xl animate-pulse" />
            <div className="h-6 w-28 bg-[var(--bg-secondary)] rounded-lg animate-pulse" />
            <div className="h-20 w-full bg-[var(--bg-secondary)] rounded-2xl animate-pulse mt-4" />
            <div className="h-12 w-full bg-[var(--bg-secondary)] rounded-2xl animate-pulse mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-heading text-2xl text-[var(--text-primary)]">Product Not Found</h2>
        <Link to="/menu">
          <Button variant="primary" size="md">
            <ArrowLeft className="w-4 h-4 mr-1" /> Return to Menu
          </Button>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockStatus === "OUT_OF_STOCK" || product.isOutOfStock === true || (product.stockQuantity !== undefined && product.stockQuantity <= 0);
  const storeTiming = getStoreOpenStatus(storeSettings);
  const isStoreClosed = !storeTiming.isOpen;
  const isActionDisabled = isOutOfStock || isStoreClosed;

  const selectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[selectedSizeIndex] : null;
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const effectiveBasePrice = hasDiscount ? (product.discountPrice as number) : product.price;

  const displayPrice = (selectedSize && selectedSize.priceOverride && selectedSize.priceOverride !== product.price)
    ? selectedSize.priceOverride
    : effectiveBasePrice;
  const originalPrice = product.price;

  const handleAddToCart = () => {
    if (isActionDisabled) return;
    addToCart(product, selectedSize || undefined, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    if (isActionDisabled) return;
    addToCart(product, selectedSize || undefined, quantity);
    setIsCheckoutModalOpen(true);
  };

  const mainImageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-12 space-y-5 sm:space-y-8">
      {/* Minimal Lightweight Navigation Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/menu")}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors cursor-pointer group py-1"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="group-hover:underline">Back to Menu</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
          <Link to="/" className="hover:text-[var(--accent-primary)] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/menu" className="hover:text-[var(--accent-primary)] transition-colors">Menu</Link>
          <span>/</span>
          <span className="text-[var(--text-secondary)] font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] aspect-square shadow-lg">
            <img
              src={mainImageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {isOutOfStock && (
              <span className="absolute top-4 right-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] bg-[var(--accent-light)] px-2.5 py-1 rounded-md">
              {product.category?.name || "Gourmet Bakery"}
            </span>
            <h1 className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] mt-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex items-center text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-500 mr-1" /> {product.rating ?? 4.9} ({product.reviewCount ?? 95} reviews)
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="font-serif-heading font-extrabold text-3xl text-[var(--accent-primary)]">
              ₹{displayPrice}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {product.description}
          </p>

          {/* Store Closed Warning Alert */}
          {isStoreClosed && (
            <div className="p-3.5 bg-[var(--accent-light)] border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] rounded-2xl text-xs font-extrabold flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
              <span>{storeTiming.notice}</span>
            </div>
          )}

          {/* Sizes / Portion Selection */}
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
              : [{ id: "default-sz", label: defaultLabel, priceOverride: displayPrice }];

            // Hide single redundant portion selector if it's just "Regular" or "Standard"
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

            const sectionHeading = isBeverage
              ? "Select Beverage Volume / Size:"
              : isIceCream
              ? "Select Scoop / Portion:"
              : isCombo
              ? "Select Combo Serving:"
              : isFastFood
              ? "Select Portion / Serving Size:"
              : isPastryOrPiece
              ? "Serving Portion (Per Piece):"
              : "Select Net Weight (kg / g):";

            return (
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[var(--accent-primary)]">
                  {sectionHeading}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sizesList.map((sz, idx) => {
                    const labelText = formatPortionLabel(sz.label, catName, product.name);

                    return (
                      <button
                        key={sz.id || idx}
                        type="button"
                        onClick={() => setSelectedSizeIndex(idx)}
                        disabled={isActionDisabled}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          selectedSizeIndex === idx
                            ? "bg-[var(--accent-light)] border-[var(--accent-primary)] font-bold text-[var(--accent-primary)] shadow-2xs"
                            : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]"
                        }`}
                      >
                        <span className="text-xs font-bold">{labelText}</span>
                        <span className="text-xs font-extrabold">₹{sz.priceOverride || product.discountPrice || product.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Preparation Time & Low Stock Urgency Banner */}
          {product.stockQuantity !== undefined && product.stockQuantity > 0 && product.stockQuantity <= 5 && (
            <div className="p-3 rounded-2xl bg-amber-500/20 dark:bg-amber-950/60 border border-amber-500/50 text-amber-950 dark:text-amber-200 text-xs font-black flex items-center gap-2 animate-pulse shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>⚡ Only {product.stockQuantity} Left in Stock! Order soon before it sells out.</span>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-2 border-t border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
              <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Prep Time: {product.preparationTime || "45 mins"}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
              <ShieldCheck className={`w-4 h-4 ${isOutOfStock ? "text-rose-600" : product.stockQuantity !== undefined && product.stockQuantity <= 5 ? "text-amber-500" : "text-emerald-600"}`} />
              <span>
                Status: {isOutOfStock ? "Out of Stock" : (product.stockQuantity !== undefined ? `${product.stockQuantity} Left in Stock` : "In Stock & Ready")}
              </span>
            </div>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-4">
              <span className="font-bold text-sm text-[var(--text-primary)]">Quantity:</span>
              <div className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isActionDisabled}
                  className="w-8 h-8 rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] flex items-center justify-center font-bold hover:bg-[var(--bg-hover)] disabled:opacity-40 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-sm text-[var(--text-primary)]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isActionDisabled || (product.stockQuantity !== undefined && quantity >= product.stockQuantity)}
                  className="w-8 h-8 rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] flex items-center justify-center font-bold hover:bg-[var(--bg-hover)] disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={isActionDisabled}
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center gap-2 font-bold shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                {isOutOfStock ? "Out of Stock" : isStoreClosed ? "Store Closed" : (addedToast ? "Added to Cart!" : "Add to Cart")}
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={isActionDisabled}
                variant="secondary"
                size="lg"
                className="w-full font-bold"
              >
                Buy Now & Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details & Key Ingredients */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="font-serif-heading font-extrabold text-xl text-[var(--text-primary)]">
          Product Details & Ingredients
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {product.description || "Freshly handcrafted with love at The Hidden Bakers in Akola using premium quality ingredients."}
        </p>

        <div className="pt-3 border-t border-[var(--border-color)]">
          <span className="font-bold text-xs uppercase tracking-wider text-[var(--accent-primary)] block mb-2.5">
            Key Ingredients
          </span>
          {Array.isArray(product.ingredients) && product.ingredients.filter(Boolean).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.ingredients.filter(Boolean).map((ing, idx) => (
                <span
                  key={ing || idx}
                  className="text-xs px-3.5 py-1.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold border border-[var(--border-color)] shadow-2xs"
                >
                  🌱 {ing.trim()}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)] italic">
              Crafted using 100% fresh, high-quality bakery ingredients.
            </p>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[var(--border-color)] space-y-6">
          <h3 className="font-serif-heading font-bold text-2xl text-[var(--text-primary)]">
            You Might Also Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct, index) => {
              const safeKey = relProduct?.id || (relProduct as any)?._id || `rel-${relProduct?.slug || index}-${index}`;
              return (
                <ProductCard key={safeKey} product={relProduct} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
