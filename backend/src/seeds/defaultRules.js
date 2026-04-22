// Default recommendation rules used to bootstrap the database.
// Runtime recommendations are read from MongoDB (collection: rules).
export const DEFAULT_RULES = [
  // wereng
  {
    jenis_hama: "wereng",
    min_frekuensi: 0,
    max_frekuensi: 0,
    status_level: "Normal",
    saran: "Tidak ada tindakan khusus. Pantau lahan secara berkala.",
    aktif: true,
  },
  {
    jenis_hama: "wereng",
    min_frekuensi: 1,
    max_frekuensi: 2,
    status_level: "Waspada",
    saran: "Intensifkan pengamatan harian. Siapkan insektisida botani sebagai tindakan preventif.",
    aktif: true,
  },
  {
    jenis_hama: "wereng",
    min_frekuensi: 3,
    max_frekuensi: null,
    status_level: "Bahaya",
    saran: "Segera aplikasikan insektisida kimia sesuai dosis anjuran. Laporkan ke PPL setempat.",
    aktif: true,
  },

  // tikus
  {
    jenis_hama: "tikus",
    min_frekuensi: 0,
    max_frekuensi: 0,
    status_level: "Normal",
    saran: "Tidak ada tindakan khusus. Periksa kondisi pematang sawah secara rutin.",
    aktif: true,
  },
  {
    jenis_hama: "tikus",
    min_frekuensi: 1,
    max_frekuensi: 2,
    status_level: "Waspada",
    saran: "Pasang perangkap TBS/LTBS di pematang lahan. Tingkatkan frekuensi pemantauan.",
    aktif: true,
  },
  {
    jenis_hama: "tikus",
    min_frekuensi: 3,
    max_frekuensi: null,
    status_level: "Bahaya",
    saran: "Lakukan gropyokan massal bersama kelompok tani. Gunakan rodentisida sesuai rekomendasi PPL.",
    aktif: true,
  },

  // burung
  {
    jenis_hama: "burung",
    min_frekuensi: 0,
    max_frekuensi: 0,
    status_level: "Normal",
    saran: "Tidak ada tindakan khusus.",
    aktif: true,
  },
  {
    jenis_hama: "burung",
    min_frekuensi: 1,
    max_frekuensi: 3,
    status_level: "Waspada",
    saran: "Aktifkan pengusir suara otomatis. Lakukan patroli pagi dan sore hari.",
    aktif: true,
  },
  {
    jenis_hama: "burung",
    min_frekuensi: 4,
    max_frekuensi: null,
    status_level: "Bahaya",
    saran: "Koordinasikan pengusiran massal bersama kelompok tani di sekitar lahan.",
    aktif: true,
  },
];

