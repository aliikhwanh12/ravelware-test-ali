const { client, database } = require("../config/influx");

async function getLatestData(panel) {
  const query = `
    SELECT *
    FROM power_meter
    WHERE panel = '${panel}'
    ORDER BY time DESC
    LIMIT 1
  `;

  const rows = await client.query(query, database);

  return rows;
}

async function getMonthlyEnergy(panel, year, month) {
  const start = `${year}-${month}-01`;
  const end = `${year}-${month}-31`;

  const query = `
    SELECT
      DATE_TRUNC('day', time) as day,
      SUM(energy_kwh) as energy
    FROM power_meter
    WHERE panel = '${panel}'
      AND time BETWEEN '${start}' AND '${end}'
    GROUP BY day
    ORDER BY day
  `;

  const rows = await client.query(query, database);

  return rows;
}

module.exports = { getLatestData, getMonthlyEnergy };
