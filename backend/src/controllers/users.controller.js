import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");

const pickPublicUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
});

export const listUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ username: 1 }).lean();
    res.json({ success: true, count: users.length, data: users.map(pickPublicUser) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const username = sanitizeString(req.body?.username);
    const email = sanitizeString(req.body?.email);
    const password = sanitizeString(req.body?.password);
    const role = sanitizeString(req.body?.role) || "petani";

    const errors = [];
    if (!username) errors.push("Field 'username' wajib diisi.");
    if (!email) errors.push("Field 'email' wajib diisi.");
    if (!password) errors.push("Field 'password' wajib diisi.");
    if (role && !["admin", "petani"].includes(role)) errors.push("Field 'role' harus 'admin' atau 'petani'.");

    if (errors.length > 0) {
      return res.status(422).json({ success: false, message: "Payload user tidak valid.", errors });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const created = await User.create({ username, email, password: hashedPassword, role });
    res.status(201).json({ success: true, data: pickPublicUser(created) });
  } catch (error) {
    // duplicate key, etc.
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const role = req.body?.role !== undefined ? sanitizeString(req.body.role) : undefined;
    const email = req.body?.email !== undefined ? sanitizeString(req.body.email) : undefined;
    const password = req.body?.password !== undefined ? sanitizeString(req.body.password) : undefined;

    const updates = {};
    const errors = [];

    if (role !== undefined) {
      if (!["admin", "petani"].includes(role)) errors.push("Field 'role' harus 'admin' atau 'petani'.");
      else updates.role = role;
    }

    if (email !== undefined) {
      if (!email) errors.push("Field 'email' tidak boleh kosong.");
      else updates.email = email;
    }

    if (password !== undefined) {
      if (!password) errors.push("Field 'password' tidak boleh kosong.");
      else updates.password = await bcrypt.hash(password, 10);
    }

    if (errors.length > 0) {
      return res.status(422).json({ success: false, message: "Payload user tidak valid.", errors });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).lean();
    if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan." });

    res.json({ success: true, data: pickPublicUser(user) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ success: false, message: "User tidak ditemukan." });
    res.json({ success: true, message: "User dihapus." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

