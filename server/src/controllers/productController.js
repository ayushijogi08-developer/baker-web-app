const prisma = require("../config/db");
const fs = require("fs");
const path = require("path");

const saveBase64Image = (base64Data) => {
  if (!base64Data || typeof base64Data !== "string") return base64Data;
  if (!base64Data.startsWith("data:image")) return base64Data;

  try {
    const matches = base64Data.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return base64Data;

    const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
    const dataBuffer = Buffer.from(matches[2], "base64");

    const uploadsDir = path.join(__dirname, "../../public/uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, dataBuffer);

    return `/uploads/${filename}`;
  } catch (err) {
    console.error("Error saving base64 image file:", err);
    return base64Data;
  }
};

const formatProduct = (p) => {
  if (!p) return p;
  const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5001}`;
  const images = (p.images || []).map((img) => ({
    ...img,
    url: img.url && img.url.startsWith("/uploads") ? `${baseUrl}${img.url}` : img.url
  }));
  return {
    ...p,
    images,
    ingredients: typeof p.ingredients === "string"
      ? p.ingredients.split(",").map((s) => s.trim()).filter(Boolean)
      : Array.isArray(p.ingredients) ? p.ingredients : []
  };
};

const getProducts = async (req, res) => {
  try {
    const { category, search, eggless, minPrice, maxPrice, sort, featured, admin } = req.query;

    const where = {};
    if (admin !== "true") {
      where.active = true;
    }

    if (category && category !== "all") {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (eggless === "true") {
      where.isEggless = true;
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (maxPrice) {
      where.price = { lte: parseFloat(maxPrice) };
    }

    let orderBy = { createdAt: "desc" };
    if (sort === "price-low") orderBy = { price: "asc" };
    if (sort === "price-high") orderBy = { price: "desc" };

    const rawProducts = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        sizes: true
      }
    });

    const products = rawProducts.map(formatProduct);
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching products.", error: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        sizes: true
      }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.json(formatProduct(product));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching product details.", error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      categoryId,
      description,
      price,
      discountPrice,
      rating,
      reviewCount,
      ingredients,
      preparationTime,
      stockQuantity,
      isOutOfStock,
      stockStatus,
      isEggless,
      featured,
      sizes,
      imageUrl,
      imageUrls
    } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: "Name, price, and category are required." });
    }

    const rawImageUrl = imageUrl || (Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : null);
    const targetImageUrl = saveBase64Image(rawImageUrl);

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const parsedPrice = parseFloat(price);
    const parsedDiscountPrice = discountPrice !== undefined && discountPrice !== "" && discountPrice !== null ? parseFloat(discountPrice) : null;
    const parsedRating = rating !== undefined && rating !== "" && rating !== null ? parseFloat(rating) : 4.9;
    const parsedReviewCount = reviewCount !== undefined && reviewCount !== "" && reviewCount !== null ? parseInt(reviewCount, 10) : 95;
    const parsedStockQty = stockQuantity !== undefined && stockQuantity !== "" && stockQuantity !== null ? parseInt(stockQuantity, 10) : 10;
    const computedIsOutOfStock = isOutOfStock === true || isOutOfStock === "true" || parsedStockQty <= 0;
    const finalStockStatus = computedIsOutOfStock ? "OUT_OF_STOCK" : (stockStatus || "IN_STOCK");

    const ingredientsStr = Array.isArray(ingredients)
      ? ingredients.join(", ")
      : typeof ingredients === "string" ? ingredients : "";

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        categoryId,
        description: description || "",
        price: parsedPrice,
        discountPrice: parsedDiscountPrice,
        rating: parsedRating,
        reviewCount: parsedReviewCount,
        ingredients: ingredientsStr,
        preparationTime: preparationTime || "45 mins",
        stockQuantity: parsedStockQty,
        isOutOfStock: computedIsOutOfStock,
        stockStatus: finalStockStatus,
        isEggless: isEggless === true || isEggless === "true",
        featured: featured === true || featured === "true",
        images: {
          create: [
            {
              url: targetImageUrl || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
              sortOrder: 0
            }
          ]
        },
        sizes: {
          create: Array.isArray(sizes) && sizes.length > 0
            ? sizes.map((s) => ({ label: s.label, priceOverride: s.priceOverride ? parseFloat(s.priceOverride) : null }))
            : [{ label: "Standard", priceOverride: null }]
        }
      },
      include: {
        category: true,
        images: true,
        sizes: true
      }
    });

    return res.status(201).json(formatProduct(newProduct));
  } catch (error) {
    return res.status(500).json({ message: "Error creating product.", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      categoryId,
      description,
      price,
      discountPrice,
      rating,
      reviewCount,
      ingredients,
      preparationTime,
      stockQuantity,
      isOutOfStock,
      stockStatus,
      isEggless,
      featured,
      active,
      imageUrl,
      imageUrls,
      sizes
    } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Product not found." });
    }

    const rawImageUrl = imageUrl || (Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : null);
    const targetImageUrl = saveBase64Image(rawImageUrl);

    const parsedStockQty = stockQuantity !== undefined && stockQuantity !== "" && stockQuantity !== null ? parseInt(stockQuantity, 10) : undefined;
    const computedIsOutOfStock = isOutOfStock !== undefined ? (isOutOfStock === true || isOutOfStock === "true") : (parsedStockQty !== undefined ? parsedStockQty <= 0 : undefined);
    const finalStockStatus = computedIsOutOfStock !== undefined ? (computedIsOutOfStock ? "OUT_OF_STOCK" : "IN_STOCK") : stockStatus;

    const ingredientsStr = ingredients !== undefined
      ? (Array.isArray(ingredients) ? ingredients.join(", ") : String(ingredients))
      : undefined;

    await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(categoryId && { categoryId }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(discountPrice !== undefined && { discountPrice: discountPrice !== "" && discountPrice !== null ? parseFloat(discountPrice) : null }),
        ...(rating !== undefined && rating !== "" && rating !== null && { rating: parseFloat(rating) }),
        ...(reviewCount !== undefined && reviewCount !== "" && reviewCount !== null && { reviewCount: parseInt(reviewCount, 10) }),
        ...(ingredientsStr !== undefined && { ingredients: ingredientsStr }),
        ...(preparationTime !== undefined && { preparationTime }),
        ...(parsedStockQty !== undefined && { stockQuantity: parsedStockQty }),
        ...(computedIsOutOfStock !== undefined && { isOutOfStock: computedIsOutOfStock }),
        ...(finalStockStatus && { stockStatus: finalStockStatus }),
        ...(isEggless !== undefined && { isEggless: Boolean(isEggless) }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(active !== undefined && { active: Boolean(active) })
      }
    });

    if (targetImageUrl) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.create({
        data: {
          productId: id,
          url: targetImageUrl,
          sortOrder: 0
        }
      });
    }

    if (Array.isArray(sizes)) {
      await prisma.productSize.deleteMany({ where: { productId: id } });
      if (sizes.length > 0) {
        for (const s of sizes) {
          const pOverride = s.priceOverride !== undefined && s.priceOverride !== null && s.priceOverride !== "" && !isNaN(parseFloat(s.priceOverride))
            ? parseFloat(s.priceOverride)
            : null;
          await prisma.productSize.create({
            data: {
              productId: id,
              label: String(s.label || "Standard"),
              priceOverride: pOverride
            }
          });
        }
      }
    }

    const finalProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        sizes: true
      }
    });

    return res.json(formatProduct(finalProduct));
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Error updating product: " + error.message, error: error.message });
  }
};

const toggleStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockStatus } = req.body; // 'IN_STOCK' | 'OUT_OF_STOCK'

    const product = await prisma.product.update({
      where: { id },
      data: { stockStatus }
    });

    return res.json(formatProduct(product));
  } catch (error) {
    return res.status(500).json({ message: "Error toggling stock status.", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.json({ message: "Product deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting product.", error: error.message });
  }
};

const validateCartItems = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.json({ valid: true, validCartItems: [], removedItems: [] });
    }

    const removedItems = [];
    const validCartItems = [];

    for (const item of items) {
      let product = null;

      if (item.productId) {
        product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { sizes: true }
        });
      }

      if (!product && (item.slug || item.name)) {
        const searchTerms = [item.slug, item.name].filter(Boolean);
        product = await prisma.product.findFirst({
          where: {
            OR: [
              ...searchTerms.map((t) => ({ slug: t })),
              ...searchTerms.map((t) => ({ name: t }))
            ]
          },
          include: { sizes: true }
        });
      }

      if (!product || !product.active) {
        removedItems.push({
          cartId: item.cartId,
          name: item.name || "Item",
          reason: "is no longer available"
        });
        continue;
      }

      if (product.isOutOfStock || product.stockStatus === "OUT_OF_STOCK" || product.stockQuantity <= 0) {
        removedItems.push({
          cartId: item.cartId,
          name: item.name || product.name,
          reason: "is currently out of stock"
        });
        continue;
      }

      validCartItems.push(item);
    }

    return res.json({
      valid: removedItems.length === 0,
      validCartItems,
      removedItems
    });
  } catch (error) {
    return res.status(500).json({ message: "Error validating cart.", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  toggleStock,
  deleteProduct,
  validateCartItems
};

