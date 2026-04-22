import Rule from "../models/rule.model.js";
import "../models/hama.model.js";
import { DEFAULT_RULES } from "../seeds/defaultRules.js";

const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const normalizeRuleInput = (payload = {}) => {
  const jenisHama = sanitizeString(payload.jenis_hama).toLowerCase();
  const min = toNumberOrNull(payload.min_frekuensi);
  const max = toNumberOrNull(payload.max_frekuensi);
  const statusLevel = sanitizeString(payload.status_level);
  const saran = sanitizeString(payload.saran);
  const aktif = payload.aktif === undefined ? true : Boolean(payload.aktif);

  return {
    jenis_hama: jenisHama,
    min_frekuensi: min ?? 0,
    max_frekuensi: max,
    status_level: statusLevel,
    saran,
    aktif,
  };
};

const normalizeLegacyRuleInput = (payload = {}) => {
  const hamaId = payload.hama_id;
  const ambangBatas = toNumberOrNull(payload.ambang_batas);
  const tingkatSerangan = sanitizeString(payload.tingkat_serangan).toLowerCase();
  const rekomendasi = sanitizeString(payload.rekomendasi);
  const aktif = payload.aktif === undefined ? true : Boolean(payload.aktif);

  return {
    hama_id: hamaId,
    ambang_batas: ambangBatas ?? 0,
    tingkat_serangan: tingkatSerangan,
    rekomendasi,
    aktif,
  };
};

const validateRuleInput = (rule) => {
  const errors = [];

  if (!rule.jenis_hama) errors.push("Field 'jenis_hama' wajib diisi.");
  if (!rule.status_level) errors.push("Field 'status_level' wajib diisi (Normal/Waspada/Bahaya).");
  if (!rule.saran) errors.push("Field 'saran' wajib diisi.");

  if (!Number.isFinite(Number(rule.min_frekuensi)) || Number(rule.min_frekuensi) < 0) {
    errors.push("Field 'min_frekuensi' harus berupa angka 0 atau lebih.");
  }

  if (rule.max_frekuensi !== null) {
    if (!Number.isFinite(Number(rule.max_frekuensi)) || Number(rule.max_frekuensi) < Number(rule.min_frekuensi)) {
      errors.push("Field 'max_frekuensi' harus null atau angka >= min_frekuensi.");
    }
  }

  return { isValid: errors.length === 0, errors };
};

const validateLegacyRuleInput = (rule) => {
  const errors = [];

  if (!rule.hama_id) errors.push("Field 'hama_id' wajib diisi.");

  if (!Number.isFinite(Number(rule.ambang_batas)) || Number(rule.ambang_batas) < 0) {
    errors.push("Field 'ambang_batas' harus berupa angka 0 atau lebih.");
  }

  if (!rule.rekomendasi) errors.push("Field 'rekomendasi' wajib diisi.");
  if (!rule.tingkat_serangan) errors.push("Field 'tingkat_serangan' wajib diisi (ringan/sedang/berat).");

  return { isValid: errors.length === 0, errors };
};

export const listRules = async (req, res) => {
  try {
    const rules = await Rule.find().populate("hama_id").sort({ jenis_hama: 1, min_frekuensi: 1, ambang_batas: 1 }).lean();
    res.json({ success: true, count: rules.length, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRule = async (req, res) => {
  try {
    const isLegacyPayload =
      req.body?.hama_id !== undefined ||
      req.body?.ambang_batas !== undefined ||
      req.body?.tingkat_serangan !== undefined ||
      req.body?.rekomendasi !== undefined;

    const normalized = isLegacyPayload ? normalizeLegacyRuleInput(req.body) : normalizeRuleInput(req.body);
    const validation = isLegacyPayload ? validateLegacyRuleInput(normalized) : validateRuleInput(normalized);
    if (!validation.isValid) {
      return res.status(422).json({ success: false, message: "Payload rule tidak valid.", errors: validation.errors });
    }

    const rule = await Rule.create(normalized);
    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRule = async (req, res) => {
  try {
    const isLegacyPayload =
      req.body?.hama_id !== undefined ||
      req.body?.ambang_batas !== undefined ||
      req.body?.tingkat_serangan !== undefined ||
      req.body?.rekomendasi !== undefined;

    const normalized = isLegacyPayload ? normalizeLegacyRuleInput(req.body) : normalizeRuleInput(req.body);
    const validation = isLegacyPayload ? validateLegacyRuleInput(normalized) : validateRuleInput(normalized);
    if (!validation.isValid) {
      return res.status(422).json({ success: false, message: "Payload rule tidak valid.", errors: validation.errors });
    }

    const rule = await Rule.findByIdAndUpdate(req.params.id, normalized, { new: true });
    if (!rule) return res.status(404).json({ success: false, message: "Rule tidak ditemukan." });

    res.json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRule = async (req, res) => {
  try {
    const deleted = await Rule.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Rule tidak ditemukan." });
    res.json({ success: true, message: "Rule dihapus." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const seedDefaultRules = async (req, res) => {
  try {
    const count = await Rule.countDocuments();
    if (count > 0) {
      const rules = await Rule.find().sort({ jenis_hama: 1, min_frekuensi: 1 }).lean();
      return res.json({
        success: true,
        message: "Rules sudah ada di database (seed dibatalkan).",
        inserted: 0,
        count: rules.length,
        data: rules,
      });
    }

    await Rule.insertMany(DEFAULT_RULES);
    const rules = await Rule.find().sort({ jenis_hama: 1, min_frekuensi: 1 }).lean();
    res.json({
      success: true,
      message: "Default rules berhasil di-seed.",
      inserted: DEFAULT_RULES.length,
      count: rules.length,
      data: rules,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
