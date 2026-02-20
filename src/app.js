require("dotenv").config();

const express = require("express");
const cors = require("cors");

const routes = require("./routes");

// jalankan MQTT subscriber
require("./config/mqtt");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", routes);

module.exports = app;
