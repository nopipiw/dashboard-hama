import { fetchLatestDetections, fetchTodayDetections, createDetectionRecord } from "../services/detections.service.js";

// Responsibilities: handle detection-related HTTP requests
export const listDetections = async (req, res, next) => {
  try {
    const data = await fetchLatestDetections();
    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const listTodayDetections = async (req, res, next) => {
  try {
    const data = await fetchTodayDetections();
    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDetection = async (req, res, next) => {
  try {
    const data = await createDetectionRecord(req.body, { source: "sensor" });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const simulateDetection = async (req, res, next) => {
  try {
    const data = await createDetectionRecord(req.body, { source: "simulation" });
    res.status(201).json({
      success: true,
      message: "Simulasi data IoT berhasil diproses.",
      data,
      simulation: {
        injected_via: "postman",
        endpoint_role: "iot-simulator",
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
