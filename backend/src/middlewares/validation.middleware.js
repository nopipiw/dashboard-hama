import { validateDetectionPayload } from "../validators/detection.validator.js";
import Hama from "../models/hama.model.js";

const normalizeJenisHama = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

export const validateDetection = async (req, res, next) => {
  const result = validateDetectionPayload(req.body);

  if (!result.isValid) {
    return res.status(422).json({
      success: false,
      message: "Payload deteksi tidak valid.",
      errors: result.errors,
    });
  }

  try {
    const jenis = normalizeJenisHama(req.body?.jenis_hama);
    if (jenis) {
      let hama = await Hama.findOne({ nama_hama: jenis });
      if (!hama) {
        hama = await Hama.create({
          nama_hama: jenis,
          aktif: false,
          meta: { created_via: "auto-detection" },
        });
      }
      req.body.hama_id = hama._id;
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
