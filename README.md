# ⚡ Energy Monitoring System Backend

Backend service untuk sistem monitoring energi listrik berbasis MQTT dan InfluxDB.

Project ini menerima data dari power meter melalui MQTT broker, menyimpannya ke database time-series, dan menyediakan REST API untuk kebutuhan dashboard monitoring energi.

---

# 📌 Features

* MQTT Data Ingestion
* Time-series Storage (InfluxDB)
* Latest Panel Data API
* Today Energy Usage Calculation
* Monthly & Yearly Energy Report
* Cost Calculation (Tarif PLN simulasi)
* REST API Documentation
* Scalable Architecture

---


# 📦 Installation & Setup

## 1. Clone Repository

```
git clone <repo-url>
cd energy-monitoring
```

## 2. Install Dependencies

```
npm install
```

## 3. Environment Variables

Buat file `.env`

```
MQTT_HOST=your_mqtt_host
INFLUX_HOST=your_host
INFLUX_TOKEN=your_token
INFLUX_BUCKET=your_bucket
```

## 4. Run Application

Development:

```
npm run dev
```
# 📁 Project Structure

```
src
 ├── config
 │    ├── influx.js
 │    └── mqtt.js
 │
 ├── controllers
 │    └── energyController.js
 │
 ├── services
 │    └── energyService.js
 │
 ├── routes
 │    └── index.js
 │
 ├── app.js
 └── server.js
```

# 🏗️ System Architecture

```
Power Meter Devices
        │
        ▼
   MQTT Broker
        │
        ▼
   Node.js Backend (Express)
        │
        ├── Data Processing
        ├── Energy Calculation
        │
        ▼
     InfluxDB Cloud
        │
        ▼
   REST API Response
        │
        ▼
   Dashboard / Client App
```

---

# 🧠 Architecture Explanation

1. Power meter mengirim data melalui MQTT topic:

   ```
   DATA/PM/{panel}
   ```

2. Backend subscribe topic MQTT lalu:

   * Validasi payload
   * Parsing data
   * Simpan ke InfluxDB

3. REST API menyediakan data:

   * Realtime latest
   * Today usage
   * Monthly usage
   * Yearly usage

---

# 🗄️ Data Model (ERD)

Karena menggunakan InfluxDB (time-series), struktur data berupa measurement.

## Measurement: `power_meter`

| Field       | Type      | Description            |
| ----------- | --------- | ---------------------- |
| panel       | tag       | Nama panel             |
| voltage_l1  | float     | Tegangan phase 1       |
| voltage_l2  | float     | Tegangan phase 2       |
| voltage_l3  | float     | Tegangan phase 3       |
| voltage_avg | float     | Tegangan rata-rata     |
| current_l1  | float     | Arus phase 1           |
| current_l2  | float     | Arus phase 2           |
| current_l3  | float     | Arus phase 3           |
| current_avg | float     | Arus rata-rata         |
| power_kw    | float     | Daya (kW)              |
| energy_kwh  | float     | Energi kumulatif (kWh) |
| kva         | float     | Apparent power         |
| pf          | float     | Power factor           |
| vunbal      | float     | Voltage unbalance      |
| iunbal      | float     | Current unbalance      |
| time        | timestamp | Waktu device           |

---

# 🚀 REST API Documentation

## Base URL

```
http://localhost:3000/
```

---

# 📡 1. Get Latest Data

### Endpoint

```
GET /latest?panel=PANEL_LANTAI_1
```

### Response

```json
{
  "status": "OK",
  "message": "Success",
  "data": {
    "pmCode": "PANEL_LANTAI_1",
    "time": "2023-07-01T15:40:00Z",
    "v": 220.5,
    "i": 10.2,
    "kw": 2.1,
    "kwh": 132.1,
    "cost": 198150
  }
}
```

---

---

# 📊 2. Yearly Energy

```
GET /yearly-energy?panel=PANEL_LANTAI_1&year=2023
```

Response:

```json
{
  "status": "OK",
  "message": "Success",
  "data": {
    "pmCode": "PANEL_LANTAI_1",
    "year": "2023",
    "month": [1,2,3,4],
    "energy": [120,150,170,200],
    "cost": [180000,225000,255000,300000]
  }
}
```

---
