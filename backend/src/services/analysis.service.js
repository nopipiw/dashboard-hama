import Detection from "../models/detection.model.js";
import Rule from "../models/rule.model.js";
import "../models/hama.model.js";
import { ensureDefaultRulesSeeded } from "./rules.bootstrap.js";
import { getAllowedPests, normalizeJenisHama } from "./pests.service.js";

const DEFAULT_FALLBACK_STATUS = "Normal";
const DEFAULT_FALLBACK_SARAN = "Aturan rekomendasi belum dikonfigurasi di database.";

const isActiveRule = (rule) => {
  if (rule?.aktif === false) return false;
  if (typeof rule?.aktif === "boolean") return rule.aktif;
  if (typeof rule?.status === "string") return rule.status === "active";
  return true;
};

const withinRange = (freq, rule) => {
  const min = Number(rule?.min_frekuensi ?? 0);
  const max = rule?.max_frekuensi === null || rule?.max_frekuensi === undefined ? Infinity : Number(rule.max_frekuensi);
  return Number.isFinite(freq) && Number.isFinite(min) && freq >= min && freq <= max;
};

const pickBestRule = (rulesForPest = [], freq = 0) => {
  const candidates = rulesForPest
    .filter((r) => withinRange(freq, r))
    .sort((a, b) => {
      const minA = Number(a.min_frekuensi ?? 0);
      const minB = Number(b.min_frekuensi ?? 0);
      if (minA !== minB) return minB - minA;

      const maxA = a.max_frekuensi === null || a.max_frekuensi === undefined ? Infinity : Number(a.max_frekuensi);
      const maxB = b.max_frekuensi === null || b.max_frekuensi === undefined ? Infinity : Number(b.max_frekuensi);
      return maxA - maxB;
    });

  return candidates[0] || null;
};

const mapTingkatSeranganToStatus = (value = "") => {
  const normalized = normalizeJenisHama(value);
  if (normalized === "ringan") return "Normal";
  if (normalized === "sedang") return "Waspada";
  if (normalized === "berat") return "Bahaya";
  return "";
};

const normalizeRuleDoc = (rule = {}) => {
  const jenis = normalizeJenisHama(rule.jenis_hama || rule?.hama_id?.nama_hama);
  const saranRaw = rule.saran || rule.rekomendasi || rule.aksi || "";
  const saran = typeof saranRaw === "string" ? saranRaw.trim() : "";
  const statusLevel =
    (typeof rule.status_level === "string" && rule.status_level.trim()) || mapTingkatSeranganToStatus(rule.tingkat_serangan);

  if (!jenis) return null;

  if (rule.min_frekuensi !== undefined || rule.max_frekuensi !== undefined) {
    return {
      jenis_hama: jenis,
      metric: "count",
      min_frekuensi: Number(rule.min_frekuensi ?? 0),
      max_frekuensi: rule.max_frekuensi === null || rule.max_frekuensi === undefined ? null : Number(rule.max_frekuensi),
      status_level: statusLevel || "",
      saran,
      aktif: rule.aktif !== false,
    };
  }

  if (rule.ambang_batas !== undefined && rule.ambang_batas !== null) {
    return {
      jenis_hama: jenis,
      metric: "jumlah",
      min_frekuensi: Number(rule.ambang_batas ?? 0),
      max_frekuensi: null,
      status_level: statusLevel || "",
      saran,
      aktif: rule.aktif !== false,
    };
  }

  return {
    jenis_hama: jenis,
    metric: "count",
    min_frekuensi: 0,
    max_frekuensi: null,
    status_level: statusLevel || "",
    saran,
    aktif: rule.aktif !== false,
  };
};


export const getRecommendations = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const detections = await Detection.find({ waktu_deteksi: { $gte: today } });

  await ensureDefaultRulesSeeded();
  const allRules = await Rule.find().populate("hama_id").lean();
  const activeRules = allRules
    .filter(isActiveRule)
    .map(normalizeRuleDoc)
    .filter(Boolean)
    .filter((r) => r.aktif !== false);

  const allowedPests = await getAllowedPests();
  const pestsFromRules = [...new Set(activeRules.map((r) => normalizeJenisHama(r.jenis_hama)).filter(Boolean))];
  const pests = allowedPests.length > 0 ? allowedPests : pestsFromRules;

  const frekuensi = Object.fromEntries(pests.map((p) => [p, 0]));
  const totalJumlah = Object.fromEntries(pests.map((p) => [p, 0]));
  detections.forEach((d) => {
    const jenis = normalizeJenisHama(d.jenis_hama);
    if (frekuensi[jenis] !== undefined) frekuensi[jenis] += 1;
    if (totalJumlah[jenis] !== undefined) totalJumlah[jenis] += Number(d.jumlah) || 0;
  });

  const hasil = Object.entries(frekuensi).map(([jenis, freq]) => {
    const rulesForPest = activeRules.filter((r) => normalizeJenisHama(r.jenis_hama) === jenis);
    const hasCountRules = rulesForPest.some((r) => r.metric === "count" && (r.status_level || r.saran));
    const metric = hasCountRules ? "count" : "jumlah";
    const metricValue = metric === "count" ? freq : totalJumlah[jenis] || 0;
    const applicable = rulesForPest.filter((r) => r.metric === metric);
    const rule = pickBestRule(applicable, metricValue);

    // Find the original Hama document to get its image and description
    const pestDoc = allRules.find(r => normalizeJenisHama(r.hama_id?.nama_hama) === jenis)?.hama_id;

    return {
      jenis_hama: jenis,
      frekuensi_deteksi: freq,
      total_jumlah: totalJumlah[jenis] || 0,
      status: rule?.status_level || DEFAULT_FALLBACK_STATUS,
      saran: rule?.saran || DEFAULT_FALLBACK_SARAN,
      gambar: pestDoc?.gambar || "",
      deskripsi: pestDoc?.deskripsi || ""
    };
  });

  return hasil;
};
