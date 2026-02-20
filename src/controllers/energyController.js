const { getLatestData, getYearlyEnergy } = require("../services/energyServices");

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

async function yearlyEnergy(req, res) {
  try {
    const panel = req.query.panel || "PANEL_LANTAI_1";
    const year = req.query.year || "2026";

    const rows = await getYearlyEnergy(panel, year);

    const month = [];
    const energy = [];
    const cost = [];

    const tariff = 1500;

    rows.forEach((row) => {
      const m = new Date(row.month).getMonth() + 1;

      const first = Number(row.first_kwh || 0);
      const last = Number(row.last_kwh || 0);

      const usage = last - first;

      month.push(m);
      energy.push(usage);
      cost.push(usage * tariff);
    });

    res.json({
      status: "OK",
      message: "",
      data: {
        pmCode: panel,
        year,
        month,
        energy,
        cost,
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

module.exports = { latestData, yearlyEnergy };
