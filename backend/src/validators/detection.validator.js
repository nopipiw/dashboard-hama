const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");

export const normalizeDetectionPayload = (payload = {}, source = "sensor") => {
  const jenisHama = sanitizeString(payload.jenis_hama).toLowerCase();
  const lokasi = sanitizeString(payload.lokasi) || "Sawah Tempuran";
  const sumberAlat =
    sanitizeString(payload.sumber_alat) ||
    (source === "simulation" ? "POSTMAN-SIMULATOR" : "IOT-Node-01");
  const providedWaktuDeteksi = payload.waktu_deteksi || payload.waktu;
  // Simulasi manual sebaiknya tercatat sebagai kejadian saat ini agar langsung muncul di dashboard hari ini.
  const waktuDeteksi = source === "simulation" ? new Date().toISOString() : providedWaktuDeteksi || new Date().toISOString();

  return {
    hama_id: payload.hama_id,
    jenis_hama: jenisHama,
    jumlah: Number(payload.jumlah),
    waktu_deteksi: waktuDeteksi,
    lokasi,
    sumber_alat: sumberAlat,
    meta: {
      ...payload.meta,
      ingestion_source: source,
      simulated_via: source === "simulation" ? "postman" : undefined,
      original_waktu_deteksi: source === "simulation" ? providedWaktuDeteksi : undefined,
    },
  };
};

export const validateDetectionPayload = (payload = {}) => {
  const errors = [];
  const jenisHama = sanitizeString(payload.jenis_hama).toLowerCase();
  const jumlah = Number(payload.jumlah);

  if (!jenisHama) {
    errors.push("Field 'jenis_hama' wajib diisi.");
  }

  if (!Number.isFinite(jumlah) || jumlah < 0) {
    errors.push("Field 'jumlah' harus berupa angka 0 atau lebih.");
  }

  if (payload.waktu_deteksi || payload.waktu) {
    const parsedDate = new Date(payload.waktu_deteksi || payload.waktu);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.push("Field 'waktu_deteksi' atau 'waktu' harus berupa tanggal yang valid.");
    }
  }

  if (payload.lokasi && typeof payload.lokasi !== "string") {
    errors.push("Field 'lokasi' harus berupa teks.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
