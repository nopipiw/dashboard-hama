import mongoose from "mongoose";

import config from "../config/index.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.dbUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export default connectDB;
