import bcrypt from "bcryptjs";

import { connectDB } from "../database/mongoose.js";
import User from "../models/user.model.js";

const username = (process.env.ADMIN_USERNAME || "").trim();
const email = (process.env.ADMIN_EMAIL || "").trim();
const password = (process.env.ADMIN_PASSWORD || "").trim();

if (!username || !email || !password) {
  console.error("Harus set env: ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD.");
  process.exit(1);
}

if (!password || password.length < 6) {
  console.error("ADMIN_PASSWORD minimal 6 karakter.");
  process.exit(1);
}

await connectDB();

const existing = await User.findOne({ username });
if (existing) {
  if (existing.role !== "admin") {
    existing.role = "admin";
    await existing.save();
    console.log(`User '${username}' sudah ada, role di-set ke admin.`);
  } else {
    console.log(`User '${username}' sudah ada (admin).`);
  }
  process.exit(0);
}

const hashed = await bcrypt.hash(password, 10);
await User.create({ username, email, password: hashed, role: "admin" });
console.log(`Admin dibuat: ${username} (${email})`);

process.exit(0);
