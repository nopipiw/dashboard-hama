import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/iot_dashboard";

// Schema minimal untuk reset
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: String,
  password: { type: String },
  role: { type: String, enum: ["admin", "petani"], default: "petani" }
});

const User = mongoose.model("User", userSchema);

async function reset() {
  try {
    console.log("Connecting to:", dbUrl);
    await mongoose.connect(dbUrl);
    
    // Hapus user demo lama jika ada agar tidak duplikat
    await User.deleteMany({ username: { $in: ["admin_demo", "petani_demo"] } });

    const salt = await bcrypt.genSalt(10);
    const passAdmin = await bcrypt.hash("admin123", salt);
    const passPetani = await bcrypt.hash("petani123", salt);

    await User.create([
      {
        username: "admin_demo",
        email: "admin@example.com",
        password: passAdmin,
        role: "admin"
      },
      {
        username: "petani_demo",
        email: "petani@example.com",
        password: passPetani,
        role: "petani"
      }
    ]);

    console.log("\n========================================");
    console.log("AKSES DEMO BERHASIL DIBUAT!");
    console.log("----------------------------------------");
    console.log("ADMIN  -> usn: admin_demo | pass: admin123");
    console.log("PETANI -> usn: petani_demo | pass: petani123");
    console.log("========================================\n");

  } catch (error) {
    console.error("Gagal reset user:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

reset();
