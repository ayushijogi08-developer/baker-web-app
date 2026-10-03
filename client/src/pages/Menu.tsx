import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Leaf, X, Utensils, Sparkles, Plus, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";
import { Product, Category } from "../types";
import { ProductCard } from "../components/ui/ProductCard";
import { useCart } from "../context/CartContext";

const FALLBACK_CATEGORIES: Category[] = [
  { id: "c1", name: "Signature Cakes", slug: "cakes", description: "Handcrafted Belgian chocolate cakes", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80", active: true, sortOrder: 1 },
  { id: "c2", name: "Gourmet Pastries", slug: "pastries", description: "Layered slice pastries", imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80", active: true, sortOrder: 2 },
  { id: "c3", name: "Fresh Breads", slug: "breads", description: "Artisanal sourdough and garlic loaves", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80", active: true, sortOrder: 3 },
  { id: "c4", name: "Savory Snacks", slug: "savory", description: "Flaky veggie puffs and rolls", imageUrl: "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=800&q=80", active: true, sortOrder: 4 }
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Belgian Truffle Cake",
    slug: "belgian-truffle-cake",
    categoryId: "c1",
    category: FALLBACK_CATEGORIES[0],
    description: "Rich, dense chocolate cake layered with silky Belgian dark chocolate ganache.",
    price: 650,
    discountPrice: 599,
    ingredients: ["Belgian Dark Chocolate", "Butter", "Wheat Flour", "Sugar"],
    preparationTime: "45 mins",
    stockStatus: "IN_STOCK",
    isEggless: true,
    featured: true,
    active: true,
    images: [{ id: "i1", url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80", sortOrder: 0 }],
    sizes: [{ id: "s1", label: "0.5 kg", priceOverride: 599 }, { id: "s2", label: "1.0 kg", priceOverride: 1150 }]
  },
  {
    id: "p2",
    name: "Classic Black Forest Gateau",
    slug: "classic-black-forest-gateau",
    categoryId: "c1",
    category: FALLBACK_CATEGORIES[0],
    description: "Moist chocolate sponge soaked with cherry syrup, fluffy whipped cream and dark cherry shavings.",
    price: 550,
    discountPrice: 499,
    ingredients: ["Dark Cherries", "Whipped Cream", "Cocoa Powder", "Flour"],
    preparationTime: "45 mins",
    stockStatus: "IN_STOCK",
    isEggless: true,
    featured: true,
    active: true,
    images: [{ id: "i2", url: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1000&q=80", sortOrder: 0 }],
    sizes: [{ id: "s3", label: "0.5 kg", priceOverride: 499 }, { id: "s4", label: "1.0 kg", priceOverride: 950 }]
  },
  {
    id: "p3",
    name: "Red Velvet Cream Cheese Cake",
    slug: "red-velvet-cream-cheese-cake",
    categoryId: "c1",
    category: FALLBACK_CATEGORIES[0],
    description: "Moist red velvet sponge layers frosted with smooth cream cheese frosting.",
    price: 700,
    discountPrice: 649,
    ingredients: ["Cream Cheese", "Cocoa", "Buttermilk", "Vanilla"],
    preparationTime: "45 mins",
    stockStatus: "IN_STOCK",
    isEggless: true,
    featured: true,
    active: true,
    images: [{ id: "i3", url: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=1000&q=80", sortOrder: 0 }],
    sizes: [{ id: "s5", label: "0.5 kg", priceOverride: 649 }, { id: "s6", label: "1.0 kg", priceOverride: 1250 }]
  },
  {
    id: "p4",
    name: "Fresh Alphonso Mango Cake",
    slug: "fresh-alphonso-mango-cake",
    categoryId: "c1",
    category: FALLBACK_CATEGORIES[0],
    description: "Light vanilla sponge infused with fresh Alphonso mango pulp and juicy fruit pieces.",
    price: 680,
    discountPrice: 620,
    ingredients: ["Fresh Alphonso Mangoes", "Vanilla Cream", "Sponge Flour"],
    preparationTime: "45 mins",
    stockStatus: "IN_STOCK",
    isEggless: true,
    featured: true,
    active: true,
    images: [{ id: "i4", url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80", sortOrder: 0 }],
    sizes: [{ id: "s7", label: "0.5 kg", priceOverride: 620 }, { id: "s8", label: "1.0 kg", priceOverride: 1190 }]
  },
  {
    id: "p5",
    name: "Blueberry Cheesecake Slice",
    slug: "blueberry-cheesecake-slice",
    categoryId: "c2",
    category: FALLBACK_CATEGORIES[1],
    description: "New York style cheesecake topped with wild blueberry compote.",
    price: 180,
    discountPrice: 159,
    ingredients: ["Wild Blueberries", "Cream Cheese", "Graham Crust"],
    preparationTime: "15 mins",
    stockStatus: "IN_STOCK",
    isEggless: true,
    featured: true,
    active: true,
    images: [{ id: "i5", url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1000&q=80", sortOrder: 0 }],
    sizes: [{ id: "s9", label: "Single Slice", priceOverride: 159 }]
  },
  {
    id: "p6",
    name: "Artisanal Sourdough Bread",
    slug: "artisanal-sourdough-bread",
    categoryId: "c3",
    category: FALLBACK_CATEGORIES[2],
    description: "Slow-fermented 36-hour sourdough loaf with golden crispy crust.",
    price: 160,
    discountPrice: 140,
    ingredients: ["Artisanal Sourdough Starter", "Organic Wheat", "Sea Salt", "Water"],
    preparationTime: "30 mins",
    stockStatus: "IN_STOCK",
    isEggless: true,
    featured: true,
    active: true,
    images: [{ id: "i6", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80", sortOrder: 0 }],
    sizes: [{ id: "s10", label: "400g Loaf", priceOverride: 140 }]
  },
  {
    id: "p7",
    name: "Flaky Veggie Paneer Puff",
    slug: "flaky-veggie-paneer-puff",
    categoryId: "c4",
    category: FALLBACK_CATEGORIES[3],
    description: "Golden flaky puff pastry loaded with spiced cottage cheese.",
    price: 45,
    discountPrice: 40,
    ingredients: ["Spiced Paneer", "Puff Pastry Butter", "Green Spices"],
    preparationTime: "10 mins",
    stockStatus: "IN_STOCK",
    isEggless: true,
    featured: true,
    active: true,
    images: [{ id: "i7", url: "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=1000&q=80", sortOrder: 0 }],
    sizes: [{ id: "s11", label: "1 Piece", priceOverride: 40 }]
  }
];

export const Menu: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "all");
  const [selectedSubGroup, setSelectedSubGroup] = useState<string>("all");
  const [onlyEggless, setOnlyEggless] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [sortBy, setSortBy] = useState<string>("popular");

  // Keep selectedCategory in sync with URL searchParams & reset scroll position
  // IMPORTANT: skip scroll reset when returning from a product detail page so
  // the saved scroll position / card-centering logic can take effect instead.
  useEffect(() => {
    const cat = searchParams.get("category");
    setSelectedCategory(cat || "all");
    setSelectedSubGroup("all");
    const isReturningFromProduct =
      sessionStorage.getItem("thb_menu_scroll_y") !== null ||
      sessionStorage.getItem("thb_last_product_id") !== null;
    if (!isReturningFromProduct) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories")
        ]);
        if (prodRes.data && prodRes.data.length > 0) {
          setProducts(prodRes.data);
        }
        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.warn("Using fallback menu items (API backend connecting...)", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Synchronously pre-position viewport BEFORE first paint so the page never
  // flashes at the top when returning from a product detail page.
  useLayoutEffect(() => {
    const savedY = sessionStorage.getItem("thb_menu_scroll_y");
    if (savedY !== null) {
      const posY = parseInt(savedY, 10);
      if (!isNaN(posY) && posY > 0) {
        window.scrollTo(0, posY);
      }
    }
  }, []);

  // After products finish loading, snap (instantly) to the exact product card
  // the user tapped so it is centred on-screen without any visible animation.
  useEffect(() => {
    if (!loading && products.length > 0) {
      const savedY = sessionStorage.getItem("thb_menu_scroll_y");
      const lastProdId = sessionStorage.getItem("thb_last_product_id");

      if (!lastProdId && savedY === null) return;

      // Clear keys immediately so subsequent searchParams changes don't
      // accidentally re-trigger the restore.
      sessionStorage.removeItem("thb_menu_scroll_y");
      sessionStorage.removeItem("thb_last_product_id");

      // Use rAF to ensure the product grid has painted before we reposition.
      const raf = requestAnimationFrame(() => {
        if (lastProdId) {
          const el = document.getElementById(`product-card-${lastProdId}`);
          if (el) {
            el.scrollIntoView({ behavior: "instant", block: "center" });
            return;
          }
        }
        if (savedY !== null) {
          const posY = parseInt(savedY, 10);
          if (!isNaN(posY)) {
            window.scrollTo({ top: posY, behavior: "instant" as ScrollBehavior });
          }
        }
      });

      return () => cancelAnimationFrame(raf);
    }
  }, [loading, products.length]);

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured || p.rating! >= 4.8);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" ||
          product.category?.slug === selectedCategory ||
          product.categoryId === selectedCategory ||
          (selectedCategory === "cakes" && (product.categoryId === "c1" || product.category?.slug === "cakes")) ||
          (selectedCategory === "pastries" && (product.categoryId === "c2" || product.category?.slug === "pastries")) ||
          (selectedCategory === "munchies" && (product.category?.slug === "munchies" || product.category?.slug === "savory")) ||
          (selectedCategory === "drinks" && product.category?.slug === "drinks") ||
          (selectedCategory === "combos" && product.category?.slug === "combos") ||
          (selectedCategory === "desserts" && product.category?.slug === "desserts");

        const matchesSubGroup =
          selectedSubGroup === "all" ||
          selectedSubGroup === "all-munchies" ||
          selectedSubGroup === "all-drinks" ||
          product.subGroup === selectedSubGroup;

        const matchesEggless = !onlyEggless || product.isEggless;

        const effectivePrice = product.discountPrice || product.price;
        const matchesPrice = effectivePrice <= maxPrice;

        return matchesSearch && matchesCategory && matchesSubGroup && matchesEggless && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") {
          return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        }
        if (sortBy === "price-high") {
          return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        }
        return 0;
      });
  }, [products, searchQuery, selectedCategory, selectedSubGroup, onlyEggless, maxPrice, sortBy]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setSelectedSubGroup("all");
    if (slug === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", slug);
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setOnlyEggless(false);
    setMaxPrice(1500);
    setSortBy("popular");
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
      {/* 1. VISUALLY RICH PHOTO-BACKED COMPACT BANNER HEADER */}
      <div className="relative rounded-3xl overflow-hidden shadow-md h-44 sm:h-52 border border-[var(--border-color)]">
        <img
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80"
          alt="The Hidden Bakers Catalog"
          className="w-full h-full object-cover brightness-[0.75]"
        />
        {/* Dark Warm Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-5 sm:p-7 text-white">
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/90 text-white px-2.5 py-0.5 rounded-md w-max shadow-2xs mb-1">
            <Sparkles className="w-3 h-3 text-amber-200" /> Artisanal Bakery Catalog
          </span>
          <h1 className="font-serif-heading font-extrabold text-2xl sm:text-3xl text-white drop-shadow-xs">
            Bakery Menu & Price List
          </h1>
          <p className="text-xs text-amber-100/90 max-w-xl mt-0.5 line-clamp-1">
            Handcrafted Belgian chocolate cakes, sourdough, flaky pastries & artisanal cookies in Akola.
          </p>
        </div>
      </div>

      {/* 2. CIRCULAR PHOTO ICON CATEGORY SELECTOR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--accent-primary)]">
            Explore Categories
          </span>
          <span className="text-[11px] font-bold text-[var(--text-muted)]">
            {filteredProducts.length} Items
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
          {/* All Categories Icon Circle */}
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            className="flex flex-col items-center gap-1.5 group cursor-pointer shrink-0"
          >
            <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${
              selectedCategory === "all"
                ? "ring-4 ring-[var(--accent-primary)] ring-offset-2 ring-offset-[var(--bg-primary)] bg-[var(--accent-primary)] text-white shadow-md scale-105"
                : "bg-[var(--bg-card)] border-2 border-[var(--border-color)] text-[var(--text-secondary)] group-hover:border-[var(--accent-primary)] group-hover:scale-105"
            }`}>
              <Utensils className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className={`text-[11px] font-bold whitespace-nowrap transition-colors ${
              selectedCategory === "all" ? "text-[var(--accent-primary)] font-extrabold" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
            }`}>
              All Items
            </span>
          </button>

          {/* Category Thumbnail Photo Circles */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
            const catImage = cat.imageUrl || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80";

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer shrink-0"
              >
                <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? "ring-4 ring-[var(--accent-primary)] ring-offset-2 ring-offset-[var(--bg-primary)] shadow-md scale-105"
                    : "border-2 border-[var(--border-color)] group-hover:border-[var(--accent-primary)] group-hover:scale-105"
                }`}>
                  <img
                    src={catImage}
                    alt={cat.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isSelected ? "scale-110 brightness-105" : "group-hover:scale-110"
                    }`}
                  />
                </div>
                <span className={`text-[11px] font-bold whitespace-nowrap transition-colors max-w-[84px] truncate ${
                  isSelected ? "text-[var(--accent-primary)] font-extrabold" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Polished Filter & Sorting Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setOnlyEggless(!onlyEggless)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              onlyEggless
                ? "bg-teal-700 text-white shadow-2xs"
                : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]"
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>100% Eggless</span>
          </button>

          <button
            type="button"
            onClick={() => setSortBy(sortBy === "featured" ? "popular" : "featured")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              sortBy === "featured"
                ? "bg-amber-500 text-amber-950 shadow-2xs"
                : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⭐ Bestsellers</span>
          </button>

          <button
            type="button"
            onClick={() => setSortBy(sortBy === "price-low" ? "popular" : "price-low")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              sortBy === "price-low"
                ? "bg-[var(--accent-primary)] text-white shadow-2xs"
                : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]"
            }`}
          >
            <span>💰 Price: Low to High</span>
          </button>

          <button
            type="button"
            onClick={() => setSortBy(sortBy === "price-high" ? "popular" : "price-high")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              sortBy === "price-high"
                ? "bg-[var(--accent-primary)] text-white shadow-2xs"
                : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]"
            }`}
          >
            <span>💎 Price: High to Low</span>
          </button>
        </div>

        {/* Sub-Category Filter Chips for Munchies & More */}
        {selectedCategory === "munchies" && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase shrink-0">Filter Munchies:</span>
            {[
              { id: "all-munchies", label: "All Munchies" },
              { id: "sandwiches", label: "Sandwiches & Burgers" },
              { id: "pizzas", label: "Pizzas (9 Inch)" },
              { id: "maggi", label: "Hot Maggi" },
              { id: "fries", label: "Fries & Quick Bites" }
            ].map(sub => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubGroup(sub.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSubGroup === sub.id
                    ? "bg-[var(--accent-primary)] text-white shadow-2xs"
                    : "bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Sub-Category Filter Chips for Shakes & Mocktails */}
        {selectedCategory === "drinks" && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase shrink-0">Filter Drinks:</span>
            {[
              { id: "all-drinks", label: "All Drinks" },
              { id: "milkshakes", label: "Thick Milkshakes" },
              { id: "mocktails", label: "Mocktails & Coolers" }
            ].map(sub => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubGroup(sub.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSubGroup === sub.id
                    ? "bg-[var(--accent-primary)] text-white shadow-2xs"
                    : "bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. SEARCH, FILTERS & PRODUCT GRID CONTROLS */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search cakes, truffles, croissants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs">
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
              <SlidersHorizontal className="w-4 h-4 text-[var(--accent-primary)]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <span>
          Showing <b>{filteredProducts.length}</b> bakery items
        </span>

        {(selectedCategory !== "all" || searchQuery || onlyEggless) && (
          <button
            onClick={clearAllFilters}
            className="text-[var(--accent-primary)] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Clear All Filters
          </button>
        )}
      </div>

      {/* Products Grid with Framer Motion Stagger Animation */}
      {filteredProducts.length > 0 ? (
        <motion.div
          key={`grid-${selectedCategory || 'all'}-${sortBy || 'default'}-${onlyEggless ? 'eggless' : 'all'}-${searchQuery || 'none'}`}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id || `menu-prod-${product.slug || idx}-${idx}`}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-20 text-center space-y-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl"
        >
          <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
            <Utensils className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-serif-heading font-bold text-xl text-[var(--text-primary)]">
            No Matching Bakery Items Found
          </h3>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-[var(--accent-primary)] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </motion.div>
      )}
    </div>
  );
};
