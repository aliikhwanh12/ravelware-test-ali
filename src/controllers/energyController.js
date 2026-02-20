const { getLatestData, getYearlyEnergy } = require("../services/energyServices");

async function latestData(req, res) {
  try {
    const panel = req.query.panel || "PANEL_LANTAI_1";

    const { latest, today } = await getLatestData(panel);
    
    // console.log("Latest data rows:", rows);

    if (!latest) {
      return res.json({
        status: "OK",
        message: "No data",
        data: null,
      });
    }
    const row = latest;
    console.log("Latest data row:", row);
    const tariff = 1500; // tarif listrik

    const voltage = Number(row.voltage_avg || 0);

    const current = Number(row.current_avg || 0);
    const kw = Number(row.power_kw || 0);
    const lastTime = new Date(row.time);
    const now = new Date();
    const diffMs = now - lastTime;
    const diffMinutes = diffMs / (1000 * 60);
    const panelStatus = diffMinutes > 5 ? "OFFLINE" : "ONLINE";
    const first = Number(today?.first_kwh || 0);
    const last = Number(today?.last_kwh || 0);
    const todayUsage = last - first;
    const cost = todayUsage * tariff;
    res.json({
      status: "OK",
      message: "",
      data: {
        pmCode: panel,
        time: row.time,
        status: panelStatus,
        v: voltage,
        i: current,
        kw: kw,
        kwh: todayUsage,
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
