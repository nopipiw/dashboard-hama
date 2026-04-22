import Hama from "../models/hama.model.js";
import Rule from "../models/rule.model.js";
import { ensureDefaultRulesSeeded } from "./rules.bootstrap.js";

export const normalizeJenisHama = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

const isRuleActive = (rule) => {
  if (rule?.aktif === false) return false;
  if (typeof rule?.aktif === "boolean") return rule.aktif;
  if (typeof rule?.status === "string") return rule.status === "active";
  return true;
};

export const getAllowedPests = async () => {
  const activeHamas = await Hama.find({ aktif: true }).sort({ nama_hama: 1 }).lean();
  if (activeHamas.length > 0) {
    return activeHamas.map((h) => normalizeJenisHama(h.nama_hama)).filter(Boolean);
  }

  await ensureDefaultRulesSeeded();
  const rules = await Rule.find().populate("hama_id").lean();
  const pests = rules
    .filter(isRuleActive)
    .map((r) => normalizeJenisHama(r.jenis_hama || r?.hama_id?.nama_hama))
    .filter(Boolean);

  return [...new Set(pests)];
};

