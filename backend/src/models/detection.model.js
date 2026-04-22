import mongoose from "mongoose";

// Responsibilities: Detection schema and model as per Class Diagram
const detectionSchema = new mongoose.Schema({
  hama_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hama" },
  jenis_hama: { type: String }, // Tetap simpan string untuk backward compatibility/MQTT data mentah
  jumlah: { type: Number, required: true },
  waktu_deteksi: { type: Date, default: Date.now },
  lokasi: { type: String, default: "Sawah Tempuran" },
  sumber_alat: { type: String, default: "IOT-Node-01" },
  meta: { type: mongoose.Schema.Types.Mixed },
});

// Methods (sesuai Class Diagram)
detectionSchema.statics.simpanData = async function (data) {
  return await this.create(data);
};

detectionSchema.statics.getDataTerbaru = async function (limit = 10) {
  return await this.find().sort({ waktu_deteksi: -1 }).limit(limit);
};

detectionSchema.statics.getRiwayat = async function () {
  return await this.find().sort({ waktu_deteksi: -1 });
};

detectionSchema.statics.getTodayDetections = async function () {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return await this.find({
    waktu_deteksi: { $gte: start, $lte: end },
  }).sort({ waktu_deteksi: -1 });
};

export default mongoose.model("Detection", detectionSchema);
