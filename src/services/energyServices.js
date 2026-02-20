const client = require("../config/influx");

async function getLatestData(panel) {
  // =========================
  // 1. Latest Data
  // =========================
  const latestQuery = `
    SELECT *
    FROM power_meter
    WHERE panel = '${panel}'
    ORDER BY time DESC
    LIMIT 1
  `;

  const latestIterator = await client.query(latestQuery);

  let latest = null;

  for await (const row of latestIterator) {
    latest = row;
  }

  // =========================
  // 2. Today Energy
  // =========================
  const todayQuery = `
    SELECT
      MIN(energy_kwh) AS first_kwh,
      MAX(energy_kwh) AS last_kwh
    FROM power_meter
    WHERE panel = '${panel}'
      AND time >= DATE_TRUNC('day', NOW())
  `;

  const todayIterator = await client.query(todayQuery);

  let today = null;

  for await (const row of todayIterator) {
    today = row;
  }

  return { latest, today };
}

async function getYearlyEnergy(panel, year) {
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;

  const query = `
    SELECT
      DATE_TRUNC('month', time) AS month,
      MIN(energy_kwh) AS first_kwh,
      MAX(energy_kwh) AS last_kwh
    FROM power_meter
    WHERE panel = '${panel}'
      AND time BETWEEN '${start}' AND '${end}'
    GROUP BY month
    ORDER BY month
  `;

  const rowsIterator = await client.query(query);

  const results = [];

  for await (const row of rowsIterator) {
    results.push(row);
  }

  return results;
}

module.exports = { getLatestData, getYearlyEnergy };
