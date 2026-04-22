import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import config from "./config/index.js";
import analysisRoutes from "./routes/analysis.routes.js";
import authRoutes from "./routes/auth.routes.js";
import detectionsRoutes from "./routes/detections.routes.js";
import hamasRoutes from "./routes/hamas.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import rulesRoutes from "./routes/rules.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With", "token"],
  }),
);

app.get("/", (req, res) => {
  res.json({
    status: "Backend SiTani Smart is Running!",
    db: mongoose.connection.readyState === 1 ? "Connected" : "Connecting/Error",
    timestamp: new Date(),
    origin_allowed: true,
  });
});

app.use(`/api${config.apiPrefix}/auth`, authRoutes);
app.use(`/api${config.apiPrefix}/detections`, detectionsRoutes);
app.use(`/api${config.apiPrefix}/analysis`, analysisRoutes);
app.use(`/api${config.apiPrefix}/notifications`, notificationRoutes);
app.use(`/api${config.apiPrefix}/rules`, rulesRoutes);
app.use(`/api${config.apiPrefix}/hamas`, hamasRoutes);
app.use(`/api${config.apiPrefix}/users`, usersRoutes);
app.use(errorHandler);

export default app;
