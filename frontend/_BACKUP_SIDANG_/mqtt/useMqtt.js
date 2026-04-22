import { useEffect, useState } from "react";
import { Client } from "paho-mqtt";

export default function useMqtt(brokerUrl, topic) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const clientId = "mqtt_client_" + Math.random().toString(16).substr(2, 8);
    const client = new Client(brokerUrl, Number(9001), clientId);

    client.onConnectionLost = (response) => {
      console.error("Koneksi MQTT hilang:", response.errorMessage);
    };

    client.onMessageArrived = (message) => {
      try {
        const payload = JSON.parse(message.payloadString);
        setData(payload);
      } catch (e) {
        console.error("Gagal parse JSON:", e);
      }
    };

    client.connect({
      onSuccess: () => {
        console.log("Terhubung ke broker MQTT");
        client.subscribe(topic);
      },
      useSSL: false,
    });

    return () => {
      client.disconnect();
    };
  }, [brokerUrl, topic]);

  return data;
}
