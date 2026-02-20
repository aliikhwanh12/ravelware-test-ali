const mqtt = require("mqtt");
const { saveEnergy } = require("../services/influxServices");
const client = mqtt.connect(process.env.MQTT_HOST);

client.on("connect", () => {
  console.log("MQTT Connected");

  client.subscribe("DATA/PM/#");
});

client.on("message", (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());

    if (payload.status !== "OK") {
      console.warn("Device not OK:", payload);
      return; // stop
    }

    const panel = topic.split("/")[2];

    saveEnergy(panel, payload.data);
    console.log(`Data saved for panel ${panel}:`, payload.data);
  } catch (err) {
    console.error("MQTT Error:", err);
  }
});


module.exports = client;
