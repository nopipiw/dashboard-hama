import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
  // New (DB-driven recommendations)
  jenis_hama: { type: String, trim: true, lowercase: true },
  min_frekuensi: { type: Number, default: 0 },
  // null means no upper bound (Infinity)
  max_frekuensi: { type: Number, default: null },
  status_level: { type: String, enum: ["Normal", "Waspada", "Bahaya"] },
  saran: { type: String, trim: true },
  aktif: { type: Boolean, default: true },

  // Legacy fields (kept for backward compatibility)
  hama_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hama" },
  ambang_batas: { type: Number },
  aksi: { type: String },
  status: { type: String, default: "active" },
  tingkat_serangan: { type: String },
  rekomendasi: { type: String },
}, { timestamps: true });

export default mongoose.model("Rule", ruleSchema);
