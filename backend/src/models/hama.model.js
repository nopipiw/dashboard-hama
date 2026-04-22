import mongoose from "mongoose";

const hamaSchema = new mongoose.Schema({
  nama_hama: { type: String, required: true, unique: true, trim: true, lowercase: true },
  deskripsi: { type: String, default: "" },
  gambar: { type: String, default: "" },
  aktif: { type: Boolean, default: true },
  meta: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.model("Hama", hamaSchema);
