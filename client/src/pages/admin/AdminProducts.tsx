import React, { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Search, Image as ImageIcon, Sparkles, UploadCloud, Link as LinkIcon, AlertCircle, AlertTriangle, X, Leaf, Eye, EyeOff } from "lucide-react";
import api from "../../services/api";
import { Product, Category, StockStatus } from "../../types";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Button } from "../../components/ui/Button";

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Dynamic Category Creation Modal State
  const [isNewCatModalOpen, setIsNewCatModalOpen] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>("");
  const [newCatDesc, setNewCatDesc] = useState<string>("");
  const [newCatPortionType, setNewCatPortionType] = useState<string>("portions");
  const [newCatSubmitting, setNewCatSubmitting] = useState<boolean>(false);
  const [newCatError, setNewCatError] = useState<string>("");
  const [catPortionTypes, setCatPortionTypes] = useState<Record<string, string>>({});

  // Dual Image Input Mode State ("url" vs "upload")
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Weight & Portion Sizes Manager State
  const [customSizes, setCustomSizes] = useState<Array<{ label: string; priceOverride: string }>>([
    { label: "0.5 kg", priceOverride: "" },
    { label: "1.0 kg", priceOverride: "" }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    discountPrice: "",
    rating: "4.9",
    reviewCount: "95",
    description: "",
    ingredients: "",
    preparationTime: "45 mins",
    stockQuantity: "10",
    isOutOfStock: false,
    isEggless: true,
    featured: false,
    active: true,
    imageUrl: ""
  });

  const fetchProducts = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/products?admin=true"),
        api.get("/categories")
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Error loading products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Category Manager Modal State
  const [isCatManagerOpen, setIsCatManagerOpen] = useState<boolean>(false);
  const [catDeleteMsg, setCatDeleteMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  const handleCreateNewCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setNewCatSubmitting(true);
    setNewCatError("");
    try {
      const res = await api.post("/categories/admin", {
        name: newCatName.trim(),
        description: newCatDesc.trim()
      });
      const createdCat = res.data;
      setCategories((prev) => [...prev, createdCat]);
      setFormData((prev) => ({ ...prev, categoryId: createdCat.id }));
      setCatPortionTypes((prev) => ({ ...prev, [createdCat.id]: newCatPortionType }));

      // Automatically populate initial portion presets based on category mapping
      if (newCatPortionType === "weight") {
        setCustomSizes([
          { label: "0.5 kg", priceOverride: "" },
          { label: "1.0 kg", priceOverride: "" }
        ]);
      } else if (newCatPortionType === "volume") {
        setCustomSizes([
          { label: "1 Scoop", priceOverride: "" },
          { label: "2 Scoops", priceOverride: "" }
        ]);
      } else {
        setCustomSizes([
          { label: "1 Portion", priceOverride: "" },
          { label: "Regular", priceOverride: "" }
        ]);
      }

      setNewCatName("");
      setNewCatDesc("");
      setIsNewCatModalOpen(false);
      setCatDeleteMsg({ type: "success", text: `Category "${createdCat.name}" created successfully.` });
    } catch (err: any) {
      setNewCatError(err.response?.data?.message || "Failed to create new category.");
    } finally {
      setNewCatSubmitting(false);
    }
  };

  // Category Reassignment State
  const [reassignCatTarget, setReassignCatTarget] = useState<{ category: Category; count: number } | null>(null);
  const [targetReassignCatId, setTargetReassignCatId] = useState<string>("");

  const initiateDeleteCategory = (category: Category) => {
    setCatDeleteMsg(null);
    const assignedProducts = products.filter((p) => p.categoryId === category.id);

    if (assignedProducts.length > 0) {
      // Find default fallback category (first category that is NOT the one being deleted)
      const fallback = categories.find((c) => c.id !== category.id);
      setTargetReassignCatId(fallback?.id || "");
      setReassignCatTarget({ category, count: assignedProducts.length });
      return;
    }

    if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      executeDeleteCategory(category.id, category.name);
    }
  };

  const executeDeleteCategory = async (catId: string, catName: string, reassignToId?: string) => {
    const countToReassign = products.filter((p) => p.categoryId === catId).length;
    try {
      setDeletingCatId(catId);

      const queryParam = reassignToId ? `?reassignToCategoryId=${encodeURIComponent(reassignToId)}` : "";
      await api.delete(`/categories/admin/${catId}${queryParam}`, {
        data: reassignToId ? { reassignToCategoryId: reassignToId } : undefined
      });

      // Update local state immediately for instant UI feedback
      setCategories((prev) => prev.filter((c) => c.id !== catId));

      if (reassignToId) {
        setProducts((prev) =>
          prev.map((p) => (p.categoryId === catId ? { ...p, categoryId: reassignToId } : p))
        );
      }

      if (selectedCategory === catId) {
        setSelectedCategory("ALL");
      }
      if (formData.categoryId === catId) {
        const remaining = categories.filter((c) => c.id !== catId);
        setFormData((prev) => ({ ...prev, categoryId: remaining[0]?.id || "" }));
      }

      const targetCatName = categories.find((c) => c.id === reassignToId)?.name;
      const reassignedText = reassignToId && countToReassign > 0
        ? ` and ${countToReassign} item(s) reassigned to "${targetCatName || 'Selected Category'}"`
        : "";

      setCatDeleteMsg({
        type: "success",
        text: `Category "${catName}" deleted successfully${reassignedText}.`
      });
      setReassignCatTarget(null);

      // Refresh full product list & categories from database
      fetchProducts();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to delete category.";
      setCatDeleteMsg({ type: "error", text: errMsg });
    } finally {
      setDeletingCatId(null);
    }
  };

  const handleCategoryChange = (catId: string) => {
    setFormData((prev) => ({ ...prev, categoryId: catId }));
    const selectedCat = categories.find((c) => c.id === catId);
    const catName = (selectedCat?.name || "").toLowerCase();

    // Auto-update portion size presets when switching category during item creation
    if (!editingId) {
      if (catName.includes("shake") || catName.includes("drink") || catName.includes("mocktail") || catName.includes("beverage")) {
        setCustomSizes([
          { label: "Regular", priceOverride: "" },
          { label: "Large", priceOverride: "" }
        ]);
      } else if (catName.includes("dessert") || catName.includes("ice cream")) {
        setCustomSizes([
          { label: "1 Scoop", priceOverride: "" },
          { label: "2 Scoops", priceOverride: "" },
          { label: "3 Scoops", priceOverride: "" }
        ]);
      } else if (catName.includes("pastr") || catName.includes("puff")) {
        setCustomSizes([
          { label: "1 Slice", priceOverride: "" },
          { label: "1 Piece", priceOverride: "" }
        ]);
      } else if (catName.includes("cake") || catName.includes("brownie")) {
        setCustomSizes([
          { label: "0.5 kg", priceOverride: "" },
          { label: "1.0 kg", priceOverride: "" }
        ]);
      } else {
        // Fallback for Munchies, Fries, Savory Snacks, Fast Food & Custom Categories
        setCustomSizes([
          { label: "1 Portion", priceOverride: "" },
          { label: "Regular", priceOverride: "" }
        ]);
      }
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setImageMode("url");
    setSelectedFileName("");
    setImageError("");
    setCustomSizes([]);
    setFormData({
      name: "",
      categoryId: "", // Force explicit category selection!
      price: "",
      discountPrice: "",
      rating: "4.9",
      reviewCount: "95",
      description: "",
      ingredients: "",
      preparationTime: "45 mins",
      stockQuantity: "10",
      isOutOfStock: false,
      isEggless: true,
      featured: false,
      active: true,
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85"
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingId(p.id);
    let existingImg = p.images[0]?.url || "";
    if (existingImg.startsWith("blob:")) {
      existingImg = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85";
    }
    const isBase64 = existingImg.startsWith("data:image");
    setImageMode(isBase64 ? "upload" : "url");
    setSelectedFileName(isBase64 ? "Uploaded Image" : "");
    setImageError("");

    if (p.sizes && p.sizes.length > 0) {
      setCustomSizes(
        p.sizes.map((s) => ({
          label: s.label,
          priceOverride: s.priceOverride ? String(s.priceOverride) : ""
        }))
      );
    } else {
      setCustomSizes([{ label: "0.5 kg", priceOverride: "" }]);
    }

    const isOut = p.isOutOfStock || p.stockStatus === "OUT_OF_STOCK" || (p.stockQuantity !== undefined && p.stockQuantity <= 0);

    setFormData({
      name: p.name,
      categoryId: p.categoryId,
      price: String(p.price),
      discountPrice: p.discountPrice ? String(p.discountPrice) : "",
      rating: p.rating !== undefined && p.rating !== null ? String(p.rating) : "4.9",
      reviewCount: p.reviewCount !== undefined && p.reviewCount !== null ? String(p.reviewCount) : "95",
      description: p.description || "",
      ingredients: Array.isArray(p.ingredients) ? p.ingredients.join(", ") : (p.ingredients || ""),
      preparationTime: p.preparationTime || "45 mins",
      stockQuantity: String(p.stockQuantity ?? 10),
      isOutOfStock: isOut,
      isEggless: p.isEggless,
      featured: p.featured,
      active: p.active !== false,
      imageUrl: existingImg
    });
    setIsModalOpen(true);
  };

  // Handle local image file upload from device gallery
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    setImageError("");
    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
          setFormData((prev) => ({ ...prev, imageUrl: compressedBase64 }));
        } else {
          setFormData((prev) => ({ ...prev, imageUrl: src }));
        }
      };
      img.onerror = () => {
        setFormData((prev) => ({ ...prev, imageUrl: src }));
      };
      img.src = src;
    };
    reader.onerror = () => {
      setImageError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formSubmitError, setFormSubmitError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitError("");

    if (!formData.imageUrl.trim()) {
      setImageError("Please provide an Image URL or upload a photo file from your device.");
      return;
    }

    if (formData.imageUrl.trim().startsWith("blob:")) {
      setImageError("Blob URLs are temporary browser references and cannot be saved. Please click 'Upload File' tab to select a photo from your gallery or paste a public web URL.");
      return;
    }

    try {
      setSubmitting(true);
      const parsedStockQty = parseInt(formData.stockQuantity, 10) || 0;

      const sizesPayload = customSizes
        .filter((s) => s.label.trim())
        .map((s) => ({
          label: s.label.trim(),
          priceOverride: s.priceOverride ? parseFloat(s.priceOverride) : undefined
        }));

      const payload = {
        name: formData.name,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        rating: formData.rating ? parseFloat(formData.rating) : 4.9,
        reviewCount: formData.reviewCount ? parseInt(formData.reviewCount, 10) : 95,
        description: formData.description,
        ingredients: formData.ingredients,
        preparationTime: formData.preparationTime,
        stockQuantity: parsedStockQty,
        isOutOfStock: formData.isOutOfStock || parsedStockQty <= 0,
        stockStatus: (formData.isOutOfStock || parsedStockQty <= 0) ? "OUT_OF_STOCK" : "IN_STOCK",
        isEggless: formData.isEggless,
        featured: formData.featured,
        active: formData.active,
        imageUrl: formData.imageUrl,
        imageUrls: [formData.imageUrl],
        sizes: sizesPayload
      };

      if (editingId) {
        await api.put(`/products/admin/${editingId}`, payload);
      } else {
        await api.post("/products/admin", payload);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error("Error saving product", err);
      const errMsg = err?.response?.data?.message || "Failed to update bakery item. Please check server logs.";
      setFormSubmitError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStock = async (p: Product) => {
    const newStock: StockStatus = p.stockStatus === "IN_STOCK" ? "OUT_OF_STOCK" : "IN_STOCK";
    try {
      await api.put(`/products/admin/${p.id}/stock`, { stockStatus: newStock });
      fetchProducts();
    } catch (err) {
      console.error("Error updating stock status", err);
    }
  };

  const handleToggleActive = async (p: Product) => {
    const newActiveState = p.active === false ? true : false;
    try {
      await api.put(`/products/admin/${p.id}`, {
        name: p.name,
        categoryId: p.categoryId,
        price: p.price,
        discountPrice: p.discountPrice,
        rating: p.rating,
        reviewCount: p.reviewCount,
        description: p.description,
        ingredients: p.ingredients,
        preparationTime: p.preparationTime,
        stockQuantity: p.stockQuantity,
        isOutOfStock: p.isOutOfStock,
        stockStatus: p.stockStatus,
        isEggless: p.isEggless,
        featured: p.featured,
        active: newActiveState,
        imageUrl: p.images[0]?.url,
        imageUrls: p.images.map((img) => img.url),
        sizes: p.sizes
      });
      fetchProducts();
    } catch (err) {
      console.error("Error toggling active status", err);
    }
  };

  const handleQuickAdjustStock = async (p: Product, delta: number) => {
    try {
      const currentQty = p.stockQuantity ?? (p.isOutOfStock ? 0 : 10);
      const newQty = Math.max(0, currentQty + delta);
      const isOut = newQty === 0;

      await api.put(`/products/admin/${p.id}`, {
        name: p.name,
        categoryId: p.categoryId,
        price: p.price,
        discountPrice: p.discountPrice,
        rating: p.rating,
        reviewCount: p.reviewCount,
        description: p.description,
        ingredients: p.ingredients,
        preparationTime: p.preparationTime,
        stockQuantity: newQty,
        isOutOfStock: isOut,
        stockStatus: isOut ? "OUT_OF_STOCK" : "IN_STOCK",
        isEggless: p.isEggless,
        featured: p.featured,
        active: p.active !== false,
        imageUrl: p.images[0]?.url,
        imageUrls: p.images.map((img) => img.url),
        sizes: p.sizes
      });
      fetchProducts();
    } catch (err) {
      console.error("Error adjusting stock quantity", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this bakery item from database?")) return;
    try {
      await api.delete(`/products/admin/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || p.categoryId === selectedCategory;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && p.active !== false) ||
      (statusFilter === "INACTIVE" && p.active === false);
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-heading font-extrabold text-3xl text-[var(--text-primary)]">
              Products & Stock Management
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Add new bakery items, upload photo gallery images, edit pricing, and toggle instant stock status.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Button onClick={handleOpenCreateModal} variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1" /> Add New Bakery Item
            </Button>
            <Button onClick={() => setIsCatManagerOpen(true)} variant="secondary" size="sm" className="text-xs justify-center font-bold">
              ⚙️ Manage Categories
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between shadow-xs">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            {/* Active / Inactive Status Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] text-xs font-bold shrink-0 w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === "ALL"
                    ? "bg-[var(--bg-card)] text-[var(--accent-primary)] shadow-2xs font-extrabold"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("ACTIVE")}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  statusFilter === "ACTIVE"
                    ? "bg-emerald-600 text-white shadow-2xs font-extrabold"
                    : "text-[var(--text-muted)] hover:text-emerald-500"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("INACTIVE")}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  statusFilter === "INACTIVE"
                    ? "bg-slate-700 text-white shadow-2xs font-extrabold"
                    : "text-[var(--text-muted)] hover:text-slate-400"
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" /> Inactive
              </button>
            </div>
          </div>

          {/* Category Filter Bar with Edge Scroll Affordance */}
          <div className="relative overflow-hidden w-full md:w-auto">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto py-1 text-xs">
              <button
                onClick={() => setSelectedCategory("ALL")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === "ALL"
                    ? "bg-[var(--accent-primary)] text-white shadow-xs"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)]"
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === c.id
                      ? "bg-[var(--accent-primary)] text-white shadow-xs"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE VIEW (<768px): Stacked Responsive Product Cards */}
        <div className="md:hidden space-y-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => {
              const mainImg = p.images[0]?.url || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80";
              const isOut = p.isOutOfStock || p.stockStatus === "OUT_OF_STOCK" || (p.stockQuantity !== undefined && p.stockQuantity <= 0);

              return (
                <div key={p.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl shadow-xs space-y-3">
                  {/* Top Row: Image, Name, Category, Price & Action Buttons */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={mainImg}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover border border-[var(--border-color)] shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-[var(--text-primary)] leading-snug">{p.name}</h4>
                        <span className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-wider block mt-0.5">
                          {p.category?.name || "Gourmet Bakery"}
                        </span>
                        <div className="font-extrabold text-[var(--accent-primary)] font-serif-heading text-sm mt-0.5">
                          ₹{p.discountPrice || p.price}
                          {p.discountPrice && (
                            <span className="text-[10px] text-[var(--text-muted)] line-through ml-1 font-sans">
                              ₹{p.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent-primary)] bg-[var(--bg-secondary)] border border-[var(--border-color)] cursor-pointer"
                        title="Edit Item"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/30 cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Row: High-Contrast Stock Pill & Quick Adjustments */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickAdjustStock(p, -1)}
                        className="w-6 h-6 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-black text-xs hover:bg-[var(--accent-primary)] hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                        title="Decrease Stock"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleToggleStock(p)}
                        className="h-7 whitespace-nowrap inline-flex items-center justify-center px-3 text-[11px] rounded-full font-semibold border transition-all cursor-pointer"
                        style={
                          isOut
                            ? { background: 'var(--badge-danger-bg)', color: 'var(--badge-danger-text)', borderColor: 'var(--badge-danger-border)' }
                            : p.stockQuantity !== undefined && p.stockQuantity > 0 && p.stockQuantity <= 5
                            ? { background: 'var(--badge-warning-bg)', color: 'var(--badge-warning-text)', borderColor: 'var(--badge-warning-border)' }
                            : { background: 'var(--badge-success-bg)', color: 'var(--badge-success-text)', borderColor: 'var(--badge-success-border)' }
                        }
                      >
                        {isOut ? (
                          <><XCircle className="w-3.5 h-3.5 mr-1" /> Out of Stock</>
                        ) : p.stockQuantity !== undefined && p.stockQuantity > 0 && p.stockQuantity <= 5 ? (
                          <><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Low Stock ({p.stockQuantity} Left)</>
                        ) : (
                          <><CheckCircle className="w-3.5 h-3.5 mr-1" /> {p.stockQuantity !== undefined ? `${p.stockQuantity} in Stock` : 'In Stock'}</>
                        )}
                      </button>
                      <button
                        onClick={() => handleQuickAdjustStock(p, 1)}
                        className="w-6 h-6 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-black text-xs hover:bg-[var(--accent-primary)] hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                        title="Increase Stock"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className="h-6 inline-flex items-center gap-1 px-2.5 rounded-full font-semibold text-[10px] border transition-all cursor-pointer"
                        style={p.active !== false
                          ? { background: 'var(--badge-success-bg)', color: 'var(--badge-success-text)', borderColor: 'var(--badge-success-border)' }
                          : { background: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-text)', borderColor: 'var(--badge-neutral-border)' }
                        }
                        title={p.active !== false ? "Click to hide from customers" : "Click to show to customers"}
                      >
                        {p.active !== false ? (
                          <><Eye className="w-3 h-3" /> Active</>
                        ) : (
                          <><EyeOff className="w-3 h-3" /> Inactive (Hidden)</>
                        )}
                      </button>
                      {p.isEggless && (
                        <span
                          className="h-6 inline-flex items-center gap-1 px-2.5 rounded-full font-semibold text-[10px] border"
                          style={{ background: 'var(--badge-teal-bg)', color: 'var(--badge-teal-text)', borderColor: 'var(--badge-teal-border)' }}
                        >
                          <Leaf className="w-3 h-3" /> Eggless
                        </span>
                      )}
                      {p.featured && (
                        <span
                          className="h-6 inline-flex items-center gap-1 px-2.5 rounded-full font-semibold text-[10px] border"
                          style={{ background: 'var(--badge-amber-bg)', color: 'var(--badge-amber-text)', borderColor: 'var(--badge-amber-border)' }}
                        >
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
              No products found matching filters.
            </div>
          )}
        </div>

        {/* DESKTOP TABLE VIEW (>=768px): Structured Grid */}
        <div className="hidden md:block bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] uppercase tracking-wider font-extrabold text-[11px]" style={{ color: 'var(--table-header-text)' }}>
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-center">Stock Status</th>
                  <th className="p-4 text-center">Visibility</th>
                  <th className="p-4 text-center">Dietary / Feature</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const mainImg = p.images[0]?.url || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80";
                    const isOut = p.isOutOfStock || p.stockStatus === "OUT_OF_STOCK" || (p.stockQuantity !== undefined && p.stockQuantity <= 0);

                    return (
                      <tr key={p.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={mainImg}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[var(--border-color)] shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[var(--text-primary)] text-sm">{p.name}</p>
                            <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{p.description}</p>
                          </div>
                        </td>

                        <td className="p-4 font-semibold text-[var(--text-secondary)]">
                          {p.category?.name || "Uncategorized"}
                        </td>

                        <td className="p-4">
                          <div className="font-extrabold text-[var(--accent-primary)] font-serif-heading text-sm">
                            ₹{p.discountPrice || p.price}
                          </div>
                          {p.discountPrice && (
                            <span className="text-[10px] text-[var(--text-muted)] line-through">
                              ₹{p.price}
                            </span>
                          )}
                        </td>

                        {/* High-Contrast Stock Status & Quick Counter Adjustment */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleQuickAdjustStock(p, -1)}
                              className="w-6 h-6 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-black text-xs hover:bg-[var(--accent-primary)] hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                              title="Decrease Stock"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleToggleStock(p)}
                              className="h-7 whitespace-nowrap inline-flex items-center justify-center px-3 text-[11px] rounded-full font-semibold border transition-all cursor-pointer"
                              style={
                                isOut
                                  ? { background: 'var(--badge-danger-bg)', color: 'var(--badge-danger-text)', borderColor: 'var(--badge-danger-border)' }
                                  : p.stockQuantity !== undefined && p.stockQuantity > 0 && p.stockQuantity <= 5
                                  ? { background: 'var(--badge-warning-bg)', color: 'var(--badge-warning-text)', borderColor: 'var(--badge-warning-border)' }
                                  : { background: 'var(--badge-success-bg)', color: 'var(--badge-success-text)', borderColor: 'var(--badge-success-border)' }
                              }
                              title="Click to toggle Stock Status"
                            >
                              {isOut ? (
                                <><XCircle className="w-3.5 h-3.5 mr-1" /> Out of Stock</>
                              ) : p.stockQuantity !== undefined && p.stockQuantity > 0 && p.stockQuantity <= 5 ? (
                                <><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Low Stock ({p.stockQuantity} Left)</>
                              ) : (
                                <><CheckCircle className="w-3.5 h-3.5 mr-1" /> {p.stockQuantity !== undefined ? `${p.stockQuantity} in Stock` : 'In Stock'}</>
                              )}
                            </button>
                            <button
                              onClick={() => handleQuickAdjustStock(p, 1)}
                              className="w-6 h-6 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-black text-xs hover:bg-[var(--accent-primary)] hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                              title="Increase Stock"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Customer Visibility Status */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleActive(p)}
                            className="h-7 whitespace-nowrap inline-flex items-center justify-center px-3 text-[11px] rounded-full font-semibold border transition-all cursor-pointer"
                            style={p.active !== false
                              ? { background: 'var(--badge-success-bg)', color: 'var(--badge-success-text)', borderColor: 'var(--badge-success-border)' }
                              : { background: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-text)', borderColor: 'var(--badge-neutral-border)' }
                            }
                            title={p.active !== false ? "Click to mark INACTIVE (Hide from customer menu)" : "Click to mark ACTIVE (Show to customers)"}
                          >
                            {p.active !== false ? (
                              <><Eye className="w-3.5 h-3.5 mr-1" /> Active</>
                            ) : (
                              <><EyeOff className="w-3.5 h-3.5 mr-1" /> Inactive (Hidden)</>
                            )}
                          </button>
                        </td>

                        {/* Soft-pill Dietary & Feature Badges */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {p.isEggless && (
                              <span
                                className="h-6 inline-flex items-center gap-1 px-2.5 rounded-full font-semibold text-[10px] border"
                                style={{ background: 'var(--badge-teal-bg)', color: 'var(--badge-teal-text)', borderColor: 'var(--badge-teal-border)' }}
                              >
                                <Leaf className="w-3 h-3" /> Eggless
                              </span>
                            )}
                            {p.featured && (
                              <span
                                className="h-6 inline-flex items-center gap-1 px-2.5 rounded-full font-semibold text-[10px] border"
                                style={{ background: 'var(--badge-amber-bg)', color: 'var(--badge-amber-text)', borderColor: 'var(--badge-amber-border)' }}
                              >
                                <Sparkles className="w-3 h-3" /> Featured
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] cursor-pointer"
                              title="Edit Item"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/30 cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[var(--text-muted)]">
                      No bakery items found. Click "Add New Bakery Item" to populate stock.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-hidden">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 my-auto">
              {/* Fixed Header */}
              <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0 bg-[var(--bg-card)]">
                <h3 className="font-serif-heading font-extrabold text-xl text-[var(--text-primary)]">
                  {editingId ? "Edit Bakery Item" : "Add New Bakery Item"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body & Sticky Footer */}
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs scrollbar-thin">
                  {formSubmitError && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formSubmitError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">Item Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Belgian Truffle Cake"
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-[var(--text-primary)]">Category *</label>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setNewCatError("");
                            setNewCatName("");
                            setNewCatDesc("");
                            setIsNewCatModalOpen(true);
                          }}
                          className="text-[10px] font-extrabold text-[var(--accent-primary)] hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Category
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <select
                          value={formData.categoryId}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        {formData.categoryId && (
                          <button
                            type="button"
                            onClick={() => {
                              const selectedCatObj = categories.find((c) => c.id === formData.categoryId);
                              if (selectedCatObj) {
                                initiateDeleteCategory(selectedCatObj);
                              }
                            }}
                            title="Delete selected category"
                            className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[var(--text-primary)] mb-1">Base Price (₹) *</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="e.g. 600"
                        className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                    </div>
                  </div>

                  {/* DYNAMIC CATEGORY-SENSITIVE PORTION MANAGER */}
                  {(() => {
                    if (!formData.categoryId) {
                      return (
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Please select a Category above to configure portion & serving sizes.</span>
                        </div>
                      );
                    }

                    const currentCatObj = categories.find((c) => c.id === formData.categoryId);
                    const currentCatName = currentCatObj?.name || "";
                    const lowerCat = currentCatName.toLowerCase();
                    const explicitType = catPortionTypes[formData.categoryId];

                    const isBeverage = explicitType === "volume" || lowerCat.includes("shake") || lowerCat.includes("drink") || lowerCat.includes("mocktail") || lowerCat.includes("beverage") || lowerCat.includes("coffee");
                    const isIceCream = explicitType === "volume" || lowerCat.includes("dessert") || lowerCat.includes("ice cream");
                    const isCombo = lowerCat.includes("combo");
                    const isPastry = lowerCat.includes("pastr") || lowerCat.includes("puff");
                    const isCake = explicitType === "weight" || lowerCat.includes("cake") || lowerCat.includes("brownie");

                    const portionTitle = isBeverage
                      ? "🥤 Beverage Serving Sizes & Volume Options *"
                      : isIceCream
                      ? "🍨 Ice Cream & Dessert Scoop/Portion Options *"
                      : isCombo
                      ? "🎁 Combo & Value Pack Serving Descriptors *"
                      : isPastry
                      ? "🍰 Serving Portion Sizes (Slice / Piece) *"
                      : isCake
                      ? "⚖️ Cake Weight & Net Quantity Options *"
                      : `🍟 ${currentCatName} Portion & Serving Options *`;

                    const subtext = isBeverage
                      ? "Add volume/portion options (e.g. Regular, Large, 250ml, Glass)."
                      : isIceCream
                      ? "Add scoop/portion options (e.g. 1 Scoop, 2 Scoops, 3 Scoops, 4 Scoops, Family Pack)."
                      : isCombo
                      ? "Add combo set descriptors (e.g. Combo Set, 1 Set)."
                      : isPastry
                      ? "Add serving options (e.g. 1 Slice, 1 Piece, Pack of 2)."
                      : isCake
                      ? "Add weight options (e.g. 0.5 kg, 1.0 kg)."
                      : "Add portion options (e.g. 1 Portion, Regular, Large, Pack of 2, 1 Plate).";

                    const presetButtons = isBeverage
                      ? ["Regular", "Large", "250ml", "Glass"]
                      : isIceCream
                      ? ["1 Scoop", "2 Scoops", "3 Scoops", "4 Scoops", "Family Pack"]
                      : isCombo
                      ? ["Combo Set", "1 Set", "Regular"]
                      : isPastry
                      ? ["1 Slice", "1 Piece", "Pack of 2", "Box of 4"]
                      : isCake
                      ? ["0.5 kg", "1.0 kg", "1.5 kg", "2.0 kg"]
                      : ["1 Portion", "Regular", "Large", "Pack of 2", "1 Plate"];

                    return (
                      <div className="space-y-3 bg-[var(--bg-secondary)]/60 p-4 rounded-2xl border border-[var(--border-color)]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <label className="font-extrabold text-[var(--text-primary)] text-xs block">
                              {portionTitle}
                            </label>
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {subtext}
                            </span>
                          </div>

                          {/* Quick Presets */}
                          <div className="flex items-center gap-1.5 text-[10px] flex-wrap">
                            {presetButtons.map((btnLabel) => (
                              <button
                                key={btnLabel}
                                type="button"
                                onClick={() => setCustomSizes((prev) => [...prev, { label: btnLabel, priceOverride: "" }])}
                                className="px-2 py-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] font-bold hover:border-[var(--accent-primary)] cursor-pointer transition-colors"
                              >
                                + {btnLabel}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {customSizes.map((sz, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={sz.label}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCustomSizes((prev) => {
                                    const copy = [...prev];
                                    copy[idx].label = val;
                                    return copy;
                                  });
                                }}
                                placeholder={isBeverage ? "e.g. Regular or 250ml" : isIceCream ? "e.g. 1 Scoop, 2 Scoops" : isCake ? "e.g. 0.5 kg or 1.0 kg" : isPastry ? "e.g. 1 Slice or 1 Pc" : "e.g. 1 Portion or Regular"}
                                className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                              />
                              <div className="relative w-36">
                                <span className="absolute left-2.5 top-2.5 text-[var(--text-muted)] font-bold text-xs">₹</span>
                                <input
                                  type="number"
                                  value={sz.priceOverride}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomSizes((prev) => {
                                      const copy = [...prev];
                                      copy[idx].priceOverride = val;
                                      return copy;
                                    });
                                  }}
                                  placeholder="Override price"
                                  className="w-full pl-6 pr-2 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                                />
                              </div>
                              {customSizes.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setCustomSizes((prev) => prev.filter((_, i) => i !== idx))}
                                  className="p-2 text-rose-500 hover:text-rose-600 rounded-lg hover:bg-rose-500/10 border border-transparent cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setCustomSizes((prev) => [...prev, { label: "", priceOverride: "" }])}
                          className="text-[11px] font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Another Portion Option
                        </button>
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[var(--text-primary)] mb-1">
                        Discount Price (₹) <span className="font-normal text-[var(--text-muted)] text-[10px]">(Optional)</span>
                      </label>
                      <input
                        type="number"
                        value={formData.discountPrice}
                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                        placeholder="e.g. 500"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[var(--text-primary)] mb-1">Star Rating (1-5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1.0"
                        max="5.0"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        placeholder="e.g. 4.9"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[var(--text-primary)] mb-1">Total Reviews Count</label>
                      <input
                        type="number"
                        value={formData.reviewCount}
                        onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })}
                        placeholder="e.g. 95"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                    </div>
                  </div>

                  {/* DUAL IMAGE INPUT: URL vs File Upload */}
                  <div className="space-y-2.5 bg-[var(--bg-secondary)]/50 p-4 rounded-2xl border border-[var(--border-color)]">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-[var(--text-primary)]">
                        Product Photo Image *
                      </label>

                      {/* Mode Switcher Tabs */}
                      <div className="flex p-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setImageMode("url")}
                          className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                            imageMode === "url"
                              ? "bg-[var(--accent-primary)] text-white shadow-xs"
                              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          <LinkIcon className="w-3 h-3" /> Image URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageMode("upload")}
                          className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                            imageMode === "upload"
                              ? "bg-[var(--accent-primary)] text-white shadow-xs"
                              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          <UploadCloud className="w-3 h-3" /> Upload File
                        </button>
                      </div>
                    </div>

                    {/* Mode 1: URL String Input */}
                    {imageMode === "url" && (
                      <div>
                        <input
                          type="text"
                          value={formData.imageUrl}
                          onChange={(e) => {
                            setFormData({ ...formData, imageUrl: e.target.value });
                            setImageError("");
                          }}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono text-[11px]"
                        />
                      </div>
                    )}

                    {/* Mode 2: Local File Upload Input */}
                    {imageMode === "upload" && (
                      <div className="space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="device-photo-upload"
                        />

                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-[var(--border-color)] hover:border-[var(--accent-primary)] bg-[var(--bg-card)] p-4 rounded-xl text-center cursor-pointer transition-all hover:bg-[var(--bg-secondary)] space-y-1.5"
                        >
                          <UploadCloud className="w-6 h-6 text-[var(--accent-primary)] mx-auto" />
                          <p className="font-bold text-[var(--text-primary)] text-xs">
                            {selectedFileName ? `Selected: ${selectedFileName}` : "Click to select photo from gallery / device"}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)]">
                            Supports PNG, JPG, JPEG, WEBP (Max 5MB)
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 1-Click High-Res 4K Image Presets */}
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] block mb-1">
                        Or pick a 1-click high-resolution HD 4K cake photo:
                      </span>
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        {[
                          { label: "🎂 Chocolate Truffle", url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85" },
                          { label: "🍰 Black Forest", url: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=85" },
                          { label: "🍓 Red Velvet", url: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=1200&q=85" },
                          { label: "🥭 Mango Cake", url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=85" },
                          { label: "🫐 Blueberry Slice", url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=85" },
                          { label: "🥐 Paneer Puff", url: "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=1200&q=85" }
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setImageMode("url");
                              setFormData({ ...formData, imageUrl: preset.url });
                              setImageError("");
                            }}
                            className="px-2 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[var(--text-secondary)] font-bold transition-all cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image Preview Box */}
                    {formData.imageUrl && (
                      <div className="flex items-center gap-3 pt-2 border-t border-[var(--border-color)]">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-14 h-14 rounded-xl object-cover border border-[var(--border-color)] shadow-xs"
                        />
                        <div className="text-[11px] text-[var(--text-muted)] leading-tight">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 block">✓ Valid Image Preview</span>
                          {imageMode === "upload" ? "Local file loaded successfully" : "URL photo linked"}
                        </div>
                      </div>
                    )}

                    {imageError && (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 text-[11px] font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{imageError}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">Product Description</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe taste, texture, and bakery specialty..."
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">
                      Key Ingredients <span className="font-normal text-[var(--text-muted)] text-[10px]">(Comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ingredients}
                      onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                      placeholder="e.g. Dark Chocolate, Fresh Dairy Cream, Butter, Flour, Vanilla Bean"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                    />
                    <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">Separate ingredients with commas (e.g. Flour, Sugar, Milk, Cocoa)</span>
                  </div>

                  {/* Stock Tracking & Inventory Control */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[var(--bg-secondary)]/60 p-3.5 rounded-2xl border border-[var(--border-color)]">
                    <div>
                      <label className="block font-bold text-[var(--text-primary)] mb-1">Stock Quantity *</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stockQuantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          const num = parseInt(val, 10) || 0;
                          setFormData({
                            ...formData,
                            stockQuantity: val,
                            isOutOfStock: num <= 0
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                      <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">Auto-decrements on order placement</span>
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isOutOfStock}
                          onChange={(e) => setFormData({ ...formData, isOutOfStock: e.target.checked })}
                          className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                        />
                        <span className="font-bold text-rose-600 dark:text-rose-400">Mark as Out of Stock 🔴</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Eye className="w-4 h-4" /> Active (Visible to Customers)
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isEggless}
                        onChange={(e) => setFormData({ ...formData, isEggless: e.target.checked })}
                        className="rounded"
                      />
                      <span className="font-bold text-[var(--text-primary)]">100% Eggless</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded"
                      />
                      <span className="font-bold text-[var(--text-primary)]">Featured Bestseller</span>
                    </label>
                  </div>
                </div>

                {/* Fixed Sticky Footer */}
                <div className="px-6 py-4 border-t border-[var(--border-color)] flex justify-end gap-3 shrink-0 bg-[var(--bg-card)]">
                  <Button type="button" onClick={() => setIsModalOpen(false)} variant="secondary" size="md">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md" disabled={submitting}>
                    {submitting ? "Saving Changes..." : (editingId ? "Update Bakery Item" : "Save to Database")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dynamic New Category Creation Modal */}
        {isNewCatModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 my-auto">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <h3 className="font-serif-heading font-extrabold text-lg text-[var(--text-primary)]">
                  ✨ Add New Category
                </h3>
                <button
                  type="button"
                  onClick={() => setIsNewCatModalOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNewCategory} className="space-y-4 text-xs">
                {newCatError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold">
                    {newCatError}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Thick Shakes, Waffles, Pizza"
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    Category Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Short description of items in this category"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    Default Portion Type Preference
                  </label>
                  <select
                    value={newCatPortionType}
                    onChange={(e) => setNewCatPortionType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer"
                  >
                    <option value="portions">🍟 Serving Portions & Pieces (1 Portion, Regular, Pack of 2)</option>
                    <option value="weight">⚖️ Weight & Slices (0.5 kg, 1.0 kg, 1 Slice)</option>
                    <option value="volume">🥤 Volume & Scoops (1 Scoop, 2 Scoops, Regular, 250ml)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsNewCatModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={newCatSubmitting}
                  >
                    {newCatSubmitting ? "Creating..." : "Save Category"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CATEGORY MANAGER & SAFE DELETION MODAL */}
        {isCatManagerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 my-auto max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 shrink-0">
                <div>
                  <h3 className="font-serif-heading font-extrabold text-lg text-[var(--text-primary)]">
                    📁 Category Management
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Add new categories or delete unused custom categories.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCatManagerOpen(false);
                    setCatDeleteMsg(null);
                  }}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {catDeleteMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold border flex items-start gap-2 ${
                    catDeleteMsg.type === "error"
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{catDeleteMsg.text}</span>
                </div>
              )}

              {/* INLINE PRODUCT REASSIGNMENT PROMPT */}
              {reassignCatTarget && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 shrink-0 text-xs">
                  <div className="flex items-start gap-2 text-amber-700 dark:text-amber-300 font-extrabold">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                    <div>
                      <div>Reassign {reassignCatTarget.count} Item(s) Before Deleting "{reassignCatTarget.category.name}"</div>
                      <p className="font-normal text-[11px] text-[var(--text-muted)] mt-0.5">
                        Items currently assigned to this category must be moved to another category.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--text-primary)] mb-1">
                      Move Items To Target Category:
                    </label>
                    <select
                      value={targetReassignCatId}
                      onChange={(e) => setTargetReassignCatId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer"
                    >
                      {categories
                        .filter((c) => c.id !== reassignCatTarget.category.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({products.filter((p) => p.categoryId === c.id).length} items)
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setReassignCatTarget(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      disabled={!targetReassignCatId || deletingCatId === reassignCatTarget.category.id}
                      onClick={() =>
                        executeDeleteCategory(
                          reassignCatTarget.category.id,
                          reassignCatTarget.category.name,
                          targetReassignCatId
                        )
                      }
                    >
                      {deletingCatId === reassignCatTarget.category.id
                        ? "Reassigning & Deleting..."
                        : `Reassign ${reassignCatTarget.count} Items & Delete`}
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Row */}
              <div className="flex items-center justify-between bg-[var(--bg-secondary)] p-3 rounded-2xl shrink-0">
                <span className="text-xs font-extrabold text-[var(--text-primary)]">
                  Total Categories ({categories.length})
                </span>
                <Button
                  onClick={() => setIsNewCatModalOpen(true)}
                  variant="primary"
                  size="sm"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add New Category
                </Button>
              </div>

              {/* Category List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-0">
                {categories.map((c) => {
                  const assignedCount = products.filter((p) => p.categoryId === c.id).length;
                  const isDeleting = deletingCatId === c.id;

                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] hover:border-[var(--accent-primary)]/40 transition-all"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[var(--text-primary)]">
                            {c.name}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              assignedCount > 0
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {assignedCount} {assignedCount === 1 ? "item" : "items"} assigned
                          </span>
                        </div>
                        {c.description && (
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                            {c.description}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => initiateDeleteCategory(c)}
                        disabled={isDeleting}
                        title={`Delete ${c.name}`}
                        className={`p-2 rounded-xl border transition-all cursor-pointer bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-600 hover:text-white`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex justify-end shrink-0">
                <Button
                  onClick={() => {
                    setIsCatManagerOpen(false);
                    setCatDeleteMsg(null);
                  }}
                  variant="secondary"
                  size="sm"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
