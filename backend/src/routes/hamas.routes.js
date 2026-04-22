import express from "express";

import { createHama, deleteHama, listHamas, updateHama } from "../controllers/hamas.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", listHamas);
router.post("/", createHama);
router.put("/:id", updateHama);
router.delete("/:id", deleteHama);

export default router;

