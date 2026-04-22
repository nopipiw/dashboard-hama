import Detection from "../models/detection.model.js";
import { createAlertFromDetection } from "./alert.service.js";
import { normalizeDetectionPayload } from "../validators/detection.validator.js";
import { getAllowedPests, normalizeJenisHama } from "./pests.service.js";

// Responsibilities: business logic for detections
export const fetchLatestDetections = async (limit = 50) => {
  // Ambil data deteksi, urutkan berdasarkan waktu descending (Sesuai Class Diagram)
  const allowed = await getAllowedPests();
  const items = await Detection.getDataTerbaru(limit);
  if (!allowed.length) return items;
  const allowSet = new Set(allowed);
  return items.filter((d) => allowSet.has(normalizeJenisHama(d.jenis_hama)));
};

export const fetchTodayDetections = async () => {
  const allowed = await getAllowedPests();
  const items = await Detection.getTodayDetections();
  if (!allowed.length) return items;
  const allowSet = new Set(allowed);
  return items.filter((d) => allowSet.has(normalizeJenisHama(d.jenis_hama)));
};

export const createDetectionRecord = async (payload, options = {}) => {
  const normalizedPayload = normalizeDetectionPayload(payload, options.source || "sensor");
  const detection = new Detection(normalizedPayload);
  const savedDetection = await detection.save();
  await createAlertFromDetection(savedDetection);
  return savedDetection;
};

