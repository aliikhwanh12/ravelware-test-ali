const { Point } = require("@influxdata/influxdb3-client");
const client = require("../config/influx");

async function saveEnergy(panel, data) {
  try {
    const point = Point.measurement("power_meter")
      .setTag("panel", panel)

      // Voltage
      .setFloatField("voltage_l1", Number(data.v?.[0] || 0))
      .setFloatField("voltage_l2", Number(data.v?.[1] || 0))
      .setFloatField("voltage_l3", Number(data.v?.[2] || 0))
      .setFloatField("voltage_avg", Number(data.v?.[3] || 0))

      // Current
      .setFloatField("current_l1", Number(data.i?.[0] || 0))
      .setFloatField("current_l2", Number(data.i?.[1] || 0))
      .setFloatField("current_l3", Number(data.i?.[2] || 0))
      .setFloatField("current_avg", Number(data.i?.[3] || 0))

      // Power
      .setFloatField("power_kw", Number(data.kw || 0))
      .setFloatField("energy_kwh", Number(data.kwh || 0))
      .setFloatField("kva", Number(data.KVA || 0))
      .setFloatField("pf", Number(data.pf || 0))
      .setFloatField("vunbal", Number(data.vunbal || 0))
      .setFloatField("iunbal", Number(data.iunbal || 0))

      // Timestamp
      .setTimestamp(data.time ? new Date(data.time) : new Date());

    await client.write(point);

    console.log("✅ Data saved to InfluxDB 3");
  } catch (err) {
    console.error("❌ InfluxDB Write Error:", err);
  }
}

module.exports = { saveEnergy };
