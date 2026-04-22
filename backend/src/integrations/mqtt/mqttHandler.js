import mqtt from "mqtt";

import Detection from "../../models/detection.model.js";
import { createAlertFromDetection } from "../../services/alert.service.js";
import { normalizeDetectionPayload } from "../../validators/detection.validator.js";

export const setupMqtt = (io) => {
  const client = mqtt.connect(process.env.MQTT_URL || "mqtt://broker.emqx.io:1883");
  const topic = process.env.MQTT_TOPIC || "iot/hama/tempuran_smart_farm_99";

  client.on("connect", () => {
    console.log("MQTT Connected");
    client.subscribe(topic, (error) => {
      if (!error) {
        console.log(`Subscribed to: ${topic}`);
      }
    });
  });

  client.on("message", async (receivedTopic, message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("Data IoT diterima:", data, "topic:", receivedTopic);

      const payload = normalizeDetectionPayload({ ...data, waktu_deteksi: data.waktu_deteksi || data.waktu }, "sensor");
      const savedDetection = await Detection.simpanData(payload);

      io.emit("new-detection", savedDetection);

      const notif = await createAlertFromDetection(savedDetection);
      if (notif) {
        io.emit("hama-alert", {
          message: notif.message,
          data: savedDetection,
        });
        console.log("Notifikasi dikirim:", notif.message);
      }
    } catch (error) {
      console.error("Error memproses data IoT:", error);
    }
  });
};
