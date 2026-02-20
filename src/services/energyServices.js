const client = require("../config/influx");

async function getLatestData(panel) {
  const query = `
    SELECT
      MIN(energy_kwh) as first_kwh,
      MAX(energy_kwh) as last_kwh
    FROM power_meter
    WHERE panel = '${panel}'
      AND time >= DATE_TRUNC('day', NOW())
  `;

  const rowsIterator = await client.query(query);

  const results = [];

  for await (const row of rowsIterator) {
    results.push(row);
  }

  return results;
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
