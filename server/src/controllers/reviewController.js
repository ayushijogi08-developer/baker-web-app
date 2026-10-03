const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all customer reviews (sorted by newest)
const getReviews = async (req, res) => {
  try {
    const { productId } = req.query;
    const where = productId ? { productId } : {};
    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { id: true, name: true, slug: true }
        }
      }
    });
    return res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ message: 'Failed to fetch reviews.' });
  }
};

// Create a new customer review
const createReview = async (req, res) => {
  try {
    const { name, location, rating, comment, productId } = req.body;

    if (!name || !comment) {
      return res.status(400).json({ message: 'Name and review comment are required.' });
    }

    const numericRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));

    const newReview = await prisma.review.create({
      data: {
        name: name.trim(),
        location: location ? location.trim() : 'Akola',
        rating: numericRating,
        comment: comment.trim(),
        isVerified: true,
        productId: productId || null
      }
    });

    return res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ message: 'Failed to submit review.' });
  }
};

module.exports = {
  getReviews,
  createReview
};
