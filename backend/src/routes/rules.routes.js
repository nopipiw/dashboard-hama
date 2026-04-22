import express from "express";
import { createRule, deleteRule, listRules, seedDefaultRules, updateRule } from "../controllers/rules.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", listRules);
router.post("/", createRule);
router.post("/seed", seedDefaultRules);
router.put("/:id", updateRule);
router.delete("/:id", deleteRule);

export default router;
