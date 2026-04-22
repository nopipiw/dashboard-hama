import mongoose from "mongoose";
import dotenv from "dotenv";
import Detection from "../models/detection.model.js";

dotenv.config();

const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/iot_dashboard";

const pests = [
  { name: "tikus", range: [1, 5] },
  { name: "burung pipit", range: [5, 20] },
  { name: "wereng", range: [10, 50] }
];

async function seed() {
  try {
    console.log("Connecting to:", dbUrl);
    await mongoose.connect(dbUrl);
    console.log("Connected.");

    // Clear existing detections for a fresh demo feel (optional, but good for demo prep)
    // await Detection.deleteMany({});
    // console.log("Old detections cleared.");

    const detections = [];
    const now = new Date();

    // Generate data for the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Multiple detections per day
      for (let j = 0; j < 4; j++) {
        const pest = pests[Math.floor(Math.random() * pests.length)];
        const hour = Math.floor(Math.random() * 24);
        const detectionDate = new Date(date);
        detectionDate.setHours(hour);

        detections.push({
          jenis_hama: pest.name,
          jumlah: Math.floor(Math.random() * (pest.range[1] - pest.range[0] + 1)) + pest.range[0],
          waktu_deteksi: detectionDate,
          lokasi: "Sawah Tempuran Blok A",
          sumber_alat: "IOT-Node-01",
          meta: {
            temp: (25 + Math.random() * 5).toFixed(1),
            humidity: (70 + Math.random() * 20).toFixed(1)
          }
        });
      }
    }

    await Detection.insertMany(detections);
    console.log(`Successfully seeded ${detections.length} detections.`);

  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
