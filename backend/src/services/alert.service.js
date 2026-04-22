import Notification from "../models/notification.model.js";
import { getAllowedPests, normalizeJenisHama } from "./pests.service.js";

const getDefaultThreshold = () => {
  const value = Number(process.env.ALERT_THRESHOLD);
  return Number.isFinite(value) && value >= 0 ? value : 10;
};

export const getPestThreshold = () => getDefaultThreshold();

export const shouldCreateAlert = async (detection = {}) => {
  const allowed = await getAllowedPests();
  const jenis = normalizeJenisHama(detection.jenis_hama);
  if (allowed.length > 0 && !allowed.includes(jenis)) return false;

  const count = Number(detection.jumlah);
  return Number.isFinite(count) && count > getPestThreshold();
};

export const createAlertFromDetection = async (detection = {}) => {
  if (!(await shouldCreateAlert(detection))) return null;

  const location = detection.lokasi || "Sawah Tempuran";

  return await Notification.create({
    jenis_hama: detection.jenis_hama,
    jumlah: detection.jumlah,
    lokasi: location,
    message: `Peringatan! ${detection.jenis_hama} terdeteksi ${detection.jumlah} ekor di ${location}. Segera ambil tindakan!`,
    status: "belum_dibaca",
    waktu: detection.waktu_deteksi || new Date(),
  });
};
