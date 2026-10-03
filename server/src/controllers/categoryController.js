const prisma = require("../config/db");

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching categories.", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, imageUrl, sortOrder } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const newCat = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0
      }
    });

    return res.status(201).json(newCat);
  } catch (error) {
    return res.status(500).json({ message: "Error creating category.", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, active, sortOrder } = req.body;

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(imageUrl && { imageUrl }),
        ...(active !== undefined && { active }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) })
      }
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Error updating category.", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const reassignToCategoryId = req.body?.reassignToCategoryId || req.query?.reassignToCategoryId;

    // Check if products are currently assigned to this category
    const productCount = await prisma.product.count({
      where: { categoryId: id }
    });

    if (productCount > 0) {
      if (reassignToCategoryId) {
        // Reassign all assigned products to the selected target category
        await prisma.product.updateMany({
          where: { categoryId: id },
          data: { categoryId: reassignToCategoryId }
        });
      } else {
        return res.status(400).json({
          message: `Cannot delete category: ${productCount} bakery item(s) are currently assigned to it. Select a category to reassign them to or reassign them manually before deleting.`,
          productCount
        });
      }
    }

    await prisma.category.delete({ where: { id } });
    return res.json({
      message: "Category deleted successfully.",
      reassignedCount: reassignToCategoryId ? productCount : 0
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting category.", error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
