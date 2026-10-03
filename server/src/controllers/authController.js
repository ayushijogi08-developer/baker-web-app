const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const { generateToken } = require("../utils/jwt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login.", error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    return res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching user profile.", error: error.message });
  }
};

module.exports = {
  login,
  getMe
};
