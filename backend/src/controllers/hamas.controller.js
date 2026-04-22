import Hama from "../models/hama.model.js";

const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");

export const listHamas = async (req, res) => {
  try {
    const data = await Hama.find().sort({ nama_hama: 1 }).lean();
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createHama = async (req, res) => {
  try {
    const nama_hama = sanitizeString(req.body?.nama_hama).toLowerCase();
    const deskripsi = sanitizeString(req.body?.deskripsi);
    const gambar = sanitizeString(req.body?.gambar);
    const aktif = req.body?.aktif === undefined ? true : Boolean(req.body.aktif);

    const errors = [];
    if (!nama_hama) errors.push("Field 'nama_hama' wajib diisi.");
    if (errors.length > 0) return res.status(422).json({ success: false, message: "Payload hama tidak valid.", errors });

    const created = await Hama.create({ nama_hama, deskripsi, gambar, aktif });
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateHama = async (req, res) => {
  try {
    const updates = {};
    if (req.body?.nama_hama !== undefined) updates.nama_hama = sanitizeString(req.body.nama_hama).toLowerCase();
    if (req.body?.deskripsi !== undefined) updates.deskripsi = sanitizeString(req.body.deskripsi);
    if (req.body?.gambar !== undefined) updates.gambar = sanitizeString(req.body.gambar);
    if (req.body?.aktif !== undefined) updates.aktif = Boolean(req.body.aktif);

    if (updates.nama_hama !== undefined && !updates.nama_hama) {
      return res.status(422).json({ success: false, message: "Field 'nama_hama' tidak boleh kosong." });
    }

    const updated = await Hama.findByIdAndUpdate(req.params.id, updates, { new: true }).lean();
    if (!updated) return res.status(404).json({ success: false, message: "Hama tidak ditemukan." });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteHama = async (req, res) => {
  try {
    const deleted = await Hama.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ success: false, message: "Hama tidak ditemukan." });
    res.json({ success: true, message: "Hama dihapus." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

