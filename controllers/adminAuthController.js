// controllers/adminAuthController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const generateAdminToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//Optinal
// POST /api/auth/admin/register
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, department, designation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists with this email" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashed,
      department,
      designation,
    });

    const token = generateAdminToken(admin._id);

    res.status(201).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        department: admin.department,
        designation: admin.designation,
      },
    });
  } catch (err) {
    console.error("registerAdmin error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/admin/login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateAdminToken(admin._id);

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        department: admin.department,
        designation: admin.designation,
      },
    });
  } catch (err) {
    console.error("loginAdmin error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/admin/me
export const getAdminMe = async (req, res) => {
  // adminProtect already loaded req.admin
  res.json(req.admin);
};
