const { InfluxDBClient } = require("@influxdata/influxdb3-client");

const client = new InfluxDBClient({
  host: process.env.INFLUX_HOST,
  token: process.env.INFLUX_TOKEN,
  database: process.env.INFLUX_BUCKET,
});

module.exports = client;
