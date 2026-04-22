import jwt from "jsonwebtoken";

import config from "../config/index.js";
import User from "../models/user.model.js";

const getTokenFromRequest = (req) => {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (typeof auth === "string" && auth.startsWith("Bearer ")) {
    return auth.slice("Bearer ".length).trim();
  }

  // Backward compat with some clients
  const tokenHeader = req.headers.token;
  if (typeof tokenHeader === "string" && tokenHeader.trim()) return tokenHeader.trim();

  return null;
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized: token tidak ditemukan." });

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded?.id).lean();
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized: user tidak valid." });

    req.user = { id: user._id, username: user.username, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: token tidak valid." });
  }
};

export const requireAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: hanya admin." });
  }
  next();
};

