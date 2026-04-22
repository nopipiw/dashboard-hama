import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/iot_dashboard";

// Models (Minimal schema for script)
const Hama = mongoose.model("Hama", new mongoose.Schema({
  nama_hama: String,
  aktif: Boolean
}));

const Rule = mongoose.model("Rule", new mongoose.Schema({
  jenis_hama: String,
  saran: String
}));

async function renamePest() {
  try {
    console.log("Connecting to:", dbUrl);
    await mongoose.connect(dbUrl);
    console.log("Connected.");

    // 1. Update Collection Hama
    const resultHama = await Hama.updateMany(
      { nama_hama: /walang sangit/i },
      { $set: { nama_hama: "burung pipit" } }
    );
    console.log(`Updated Hamas: ${resultHama.modifiedCount} records.`);

    // 2. Update Collection Rules (jenis_hama field)
    const resultRules = await Rule.updateMany(
      { jenis_hama: /walang sangit/i },
      { $set: { jenis_hama: "burung pipit" } }
    );
    console.log(`Updated Rules (field jenis_hama): ${resultRules.modifiedCount} records.`);

    // 3. Update Saran in Rules if contains "walang sangit"
    const rulesWithSaran = await Rule.find({ saran: /walang sangit/i });
    for (const rule of rulesWithSaran) {
      const newSaran = rule.saran.replace(/walang sangit/gi, "burung pipit");
      await Rule.updateOne({ _id: rule._id }, { $set: { saran: newSaran } });
    }
    console.log(`Updated Rules (field saran): ${rulesWithSaran.length} records.`);

    console.log("Pest renamed successfully!");

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

renamePest();
