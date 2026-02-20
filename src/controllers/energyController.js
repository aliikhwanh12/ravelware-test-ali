const { getLatestData } = require("../services/energyServices");

async function latestData(req, res) {
  try {
    const panel = req.query.panel || "PANEL_LANTAI_1";

    const rows = await getLatestData(panel);

    if (!rows || rows.length === 0) {
      return res.json({
        status: "OK",
        message: "No data",
        data: null,
      });
    }

    const row = rows[0];

    const tariff = 1500; // tarif listrik

    const voltage = Number(row.voltage_avg || 0);

    const current = Number(row.current_avg || 0);
    const kwh = Number(row.energy_kwh || 0);
    const kw = Number(row.power_kw || 0);
    const cost = kwh * tariff;

    res.json({
      status: "OK",
      message: "",
      data: {
        pmCode: panel,
        time: row.time,
        v: voltage,
        i: current,
        kw: kw,
        kwh: kwh,
        cost: cost,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: "ERROR",
      message: err.message,
      data: null,
    });
  }
}

async function monthlyEnergy(req, res) {
  try {
    const panel = req.query.panel || "PANEL_LANTAI_1";
    const year = req.query.year || "2023";
    const month = req.query.month || "05";

    const rows = await getMonthlyEnergy(panel, year, month);

    const date = [];
    const energy = [];
    const cost = [];

    const tariff = 1500; // contoh tarif listrik / kWh

    rows.forEach((row) => {
      const d = new Date(row.day);

      date.push(d.getDate());
      energy.push(Number(row.energy || 0));
      cost.push(Number(row.energy || 0) * tariff);
    });

    res.json({
      status: "OK",
      message: "Success",
      data: {
        pmCode: panel,
        year,
        month,
        date,
        energy,
        cost,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: "ERROR",
      message: err.message,
    });
  }
}

module.exports = { latestData, monthlyEnergy };
