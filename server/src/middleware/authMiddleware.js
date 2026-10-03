const { verifyToken } = require("../utils/jwt");
const prisma = require("../config/db");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required. Token missing." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid authentication token. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token verification failed.", error: error.message });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== "ADMIN" && req.user.role !== "STAFF")) {
    return res.status(403).json({ message: "Access denied. Admin or Staff privileges required." });
  }
  next();
};

module.exports = {
  authenticate,
  requireAdmin
};
