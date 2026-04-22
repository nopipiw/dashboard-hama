import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/iot_dashboard";

async function fix() {
  try {
    console.log("Connecting to:", dbUrl);
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB.");

    const db = mongoose.connection.db;
    const collection = db.collection("users");

    console.log("Checking indexes for 'users' collection...");
    const indexes = await collection.indexes();
    
    const hasTargetIndex = indexes.find(idx => idx.name === "kode_perangkat_1");

    if (hasTargetIndex) {
      console.log("Found problematic index: kode_perangkat_1. Dropping...");
      await collection.dropIndex("kode_perangkat_1");
      console.log("Index dropped successfully!");
    } else {
      console.log("Index 'kode_perangkat_1' not found. Nothing to drop.");
    }

    console.log("Current indexes:", await collection.indexes());
    
  } catch (error) {
    console.error("Error fixing indexes:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fix();
