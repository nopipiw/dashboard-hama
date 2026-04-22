import express from "express";
import { login, loginAdmin, loginPetani, register } from "../controllers/auth.controller.js";

const router = express.Router();

// Minimal route definitions
router.post("/login", login);
router.post("/login-petani", loginPetani);
router.post("/login-admin", loginAdmin);
router.post("/register", register);

export default router;
