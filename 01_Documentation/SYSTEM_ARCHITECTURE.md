# AI Smart Bus Tracking & Notification System — V2.5 Architecture

## 1. System Overview
The **AI Smart Bus Tracking and Notification System** is a real-time college transit telemetry platform combining GPS fleet tracking, multi-factor predictive arrival estimation (AI ETA), driver terminal controls, passenger proximity geofencing, and immediate distress broadcasting.

---

## 2. Advanced-Level AI ETA Engine
The arrival prediction algorithm replaces simplistic distance/speed division with an **AI Multi-Factor Transit Predictor**:

$$\text{ETA} = \left(\frac{D_{\text{Haversine}}}{v_{\text{effective}}}\times 60\right) \times \text{TCI} + \left(N_{\text{stops}} \times t_{\text{dwell}}\right)$$

### Key Mathematical Factors:
1. **True Geodesic Distance ($D_{\text{Haversine}}$)**:
   Calculates exact spherical distance between the bus coordinates $(\text{lat}_1, \text{lon}_1)$ and the next stop / terminal waypoint $(\text{lat}_2, \text{lon}_2)$ using the Haversine formula:
   $$a = \sin^2\left(\frac{\Delta \text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta \text{lon}}{2}\right)$$
   $$d = 2 R \cdot \text{atan2}(\sqrt{a}, \sqrt{1-a})$$

2. **Traffic Congestion Index (TCI)**:
   - Evaluates real-time transit velocity against road type limits.
   - Detects rush hour windows (Morning peak: 08:00–10:30, Evening peak: 16:30–19:30) with an automated buffer.
   - Multipliers:
     - **Free Flow ($\ge 32\text{ km/h}$)**: 1.00x
     - **Moderate Traffic ($18 - 32\text{ km/h}$)**: 1.20x
     - **Heavy Congestion ($< 18\text{ km/h}$)**: 1.55x
     - **Signal Stopped ($0\text{ km/h}$)**: 1.45x (uses moving average rather than dividing by zero)

3. **Stop Dwell Modeling ($t_{\text{dwell}}$)**:
   - Each upcoming intermediate stop adds $\sim 1.5\text{ minutes}$ for door cycles and boarding.

4. **Dynamic AI Confidence Scoring**:
   - Generates confidence rating ($88\% - 98\%$) based on GPS signal recency and speed variance.

---

## 3. Real-Time Telemetry & Streaming
- **Server-Sent Events (SSE)**: Dedicated `/api/tracking/stream` endpoint pushes real-time location updates directly to all active browser sessions with auto-reconnection and smart fallback polling.
- **Interactive Leaflet Radar**: High-resolution OpenStreetMap rendering with directional headings, pulsing radar rings, and route corridors.
- **Integrated GPS Simulator**: Built-in 1-click and continuous simulation engine that smoothly advances buses along authentic waypoints.
- **Web Audio API Alerts**: Browser-native sound synthesis (zero missing audio files) for arrival chimes and emergency sirens.

---

## 4. Multi-Role Identity & Portals

| Role | Default Email | Default Password | Target Dashboard |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@smartbus.com` | `admin123` | `adminDashboard.html` |
| **Transit Driver** | `rajesh.driver@smartbus.com` | `driver123` | `driver.html` |
| **Student Passenger** | `kanika@smartbus.com` | `student123` | `dashboard.html` |

---

## 5. API Endpoints Reference

### Telemetry & Tracking
- `GET /api/tracking` — Get latest GPS telemetry for all active buses.
- `GET /api/tracking/:busId` — Get telemetry for a specific bus.
- `POST /api/tracking` — Update bus coordinates and speed.
- `GET /api/tracking/stream` — Real-Time Server-Sent Events (SSE) telemetry stream.
- `POST /api/tracking/simulate-step` — Advance GPS coordinate along the route waypoints.
- `POST /api/tracking/sos` — Broadcast high-priority emergency SOS.

### Predictive ETA
- `GET /api/eta` — Multi-factor predictive ETA for all fleet buses.
- `GET /api/eta/:busId` — Deep stop-by-stop ETA timeline for a specific bus.
- `POST /api/eta/simulate` — Interactive "What-If" scenario simulation.

### Fleet & Operations
- `GET /api/dashboard` — High-level fleet metrics and occupancy stats.
- `GET /api/buses` / `POST /api/buses` / `PUT /api/buses/:id` / `DELETE /api/buses/:id` — Vehicle roster management.
- `GET /api/drivers` / `POST /api/drivers` / `PUT /api/drivers/:id` / `DELETE /api/drivers/:id` — Driver registry.
- `GET /api/routes` / `POST /api/routes` / `PUT /api/routes/:id` / `DELETE /api/routes/:id` — Corridors & waypoints.
- `GET /api/students` / `POST /api/students` / `PUT /api/students/:id` / `DELETE /api/students/:id` — Student directory.
- `GET /api/allocations` / `POST /api/allocations` / `DELETE /api/allocations/:id` — Resource allocations.
- `GET /api/notifications` / `POST /api/notifications` / `DELETE /api/notifications/:id` — Announcements and alerts.
- `POST /api/auth/login` — Unified role authentication.

---

## 6. How to Run
1. Ensure MySQL is running on `localhost:3306` with database `ai_smart_bus`.
2. Start the server from `07_Backend`:
   ```bash
   node server.js
   ```
3. Open your browser at:
   ```
   http://localhost:5002
   ```
