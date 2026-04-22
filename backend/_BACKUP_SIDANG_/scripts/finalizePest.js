import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/iot_dashboard";

const Hama = mongoose.model("Hama", new mongoose.Schema({
  nama_hama: String,
  deskripsi: String,
  gambar: String,
  aktif: Boolean
}));

async function finalize() {
  try {
    await mongoose.connect(dbUrl);
    
    // Set Burung Pipit details
    await Hama.updateOne(
      { nama_hama: "burung pipit" },
      { 
        $set: { 
          deskripsi: "Hama burung pipit yang memakan bulir padi pada fase masak susu.", 
          gambar: "/images/burung-pipit.jpg", 
          aktif: true 
        } 
      }
    );

    // Ensure main pests are active
    await Hama.updateMany(
      { nama_hama: { $in: ["tikus", "wereng"] } },
      { $set: { aktif: true } }
    );

    console.log("Database finalized: Walang Sangit replaced with Burung Pipit.");
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

finalize();
