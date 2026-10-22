# 🚌 AI Smart Bus Tracking & Notification System (V2.6)

<p align="center">
  <b>Real-Time College Bus Tracking • AI-Based Multi-Factor ETA Prediction • Smart Notifications</b>
</p>

<p align="center">
  A state-of-the-art college transit telemetry platform combining authentic driver smartphone GPS tracking, predictive arrival estimation, interactive Leaflet fleet radar, passenger proximity geofencing, and immediate distress broadcasting.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JavaScript-orange" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express.js-green" alt="Backend">
  <img src="https://img.shields.io/badge/Database-MySQL-blue" alt="Database">
  <img src="https://img.shields.io/badge/Real--Time-SSE-purple" alt="Real-Time">
  <img src="https://img.shields.io/badge/GPS-HTML5%20Geolocation-brightgreen" alt="GPS Telemetry">
  <img src="https://img.shields.io/badge/Authentication-JWT-red" alt="Authentication">
</p>

---

## 📌 Overview

The **AI Smart Bus Tracking and Notification System** is an enterprise-grade transit management platform designed to automate and simplify college bus operations. 

It eliminates guessing for students waiting at stops by predicting exact arrival times using geodesic distance and traffic factors, while allowing bus drivers to stream real-time GPS telemetry from their smartphones without requiring expensive proprietary hardware.

---

## ✨ Key Features

### 📱 1. Authentic Mobile Device GPS Telemetry
- **HTML5 High-Accuracy Geolocation**: Driver Cockpit connects directly to the driver's phone/tablet GPS (`navigator.geolocation.watchPosition`).
- Streams real-time latitude, longitude, compass heading, accuracy radius ($\pm\text{meters}$), and true speedometer speed in km/h.
- Dual Mode: Includes both **Live Device GPS** and an **Autonomous AI Route Simulator** for testing.

### 🤖 2. Advanced Multi-Factor AI ETA Engine
Replaces simplistic distance/speed division with dynamic mathematical modeling:

$$\text{ETA} = \left(\frac{D_{\text{Haversine}}}{v_{\text{effective}}}\times 60\right) \times \text{TCI} + \left(N_{\text{stops}} \times t_{\text{dwell}}\right)$$

* **$D_{\text{Haversine}}$**: Geodesic spherical distance between the bus and upcoming waypoints using the Haversine formula.
* **$\text{TCI}$**: Traffic Congestion Index (1.00x Free Flow $\ge 32\text{ km/h}$, 1.20x Moderate, 1.55x Heavy Congestion, 1.45x Signal Stopped buffer).
* **$v_{\text{effective}}$**: Velocity filter preventing division by zero during signal stops ($\ge 20\text{ km/h}$ moving average).
* **$t_{\text{dwell}}$**: Average stop dwell penalty ($1.5\text{ minutes}$ per intermediate scheduled stop).
* **Confidence Rating**: Dynamic confidence score ($88\% - 98\%$) based on GPS signal recency and speed stability.

### 🗺️ 3. Interactive Leaflet Fleet Radar
- Rendered on OpenStreetMap with directional headings, pulsing radar markers, and custom waypoints.
- **Dynamic Polyline Corridors**: Automatically renders full route paths and stop sequences for all fleet buses.
- **Live Breadcrumb History**: Tracks and displays the exact physical path driven by the vehicle.
- **📍 My Location Tracking**: Allows students to pinpoint their own position and calculate distance to the approaching bus.

### 👥 4. Real-Time Occupancy Synchronization
- Driver cockpit features fine-tuned passenger controls (`+1`, `+2 Board`, `-1`, `-2 Off`).
- Updates persist directly to MySQL and broadcast live to all student and administrator dashboards.

### 🎓 5. Student Proximity Geofencing & Audio Alerts
- Automatically triggers a visual banner and browser-native audio chime when the bus is within $2.5\text{ km}$ or $\le 6\text{ minutes}$ away.
- Dynamic boarding stop resolution for personalized countdown timers.

### 🚨 6. Emergency SOS Dispatch
- Instant distress broadcast across all monitors with visual flash and emergency synthesizer siren.

---

## 🏗️ System Architecture

```text
 ┌──────────────────────┐        ┌──────────────────────┐        ┌──────────────────────┐
 │   Student Portal     │        │    Driver Cockpit    │        │   Admin Command Hub  │
 │ (Live Map & Mini-Map)│        │ (Device GPS Stream)  │        │ (Fleet & Allocations)│
 └──────────┬───────────┘        └──────────┬───────────┘        └──────────┬───────────┘
            │                               │                               │
            │ HTTP / SSE                    │ HTTP Telemetry Push           │ REST API
            ▼                               ▼                               ▼
 ┌──────────────────────────────────────────────────────────────────────────────────────┐
 │                              Node.js / Express Backend Server                        │
 │  ┌───────────────────────┐  ┌───────────────────────┐  ┌──────────────────────────┐  │
 │  │ Telemetry Controller  │  │   AI ETA Predictor    │  │ Server-Sent Events (SSE) │  │
 │  └───────────────────────┘  └───────────────────────┘  └──────────────────────────┘  │
 └──────────────────────────────────────────┬───────────────────────────────────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │     MySQL Database      │
                               │  (8 Tables + Seed Data) │
                               └─────────────────────────┘
```

---

## 🔑 Default Portal Credentials

| Role | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@smartbus.com` | `admin123` | `adminDashboard.html` |
| **Bus Driver** | `rajesh.driver@smartbus.com` | `driver123` | `driver.html` |
| **Student** | `kanika@smartbus.com` | `student123` | `dashboard.html` |

*(Pre-filled 1-click credential buttons are available on `login.html`).*

---

## 🚀 Quick Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/kanikakandasamy/AI-SmartBus-Tracking-System.git
cd AI-SmartBus-Tracking-System
```

### 2. Install Dependencies
```bash
cd 07_Backend
npm install
cd ..
```

### 3. Configure Database Credentials
Create a `.env` file (copied from `.env.example`):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ai_smart_bus
DB_PORT=3306

JWT_SECRET=smartbus_secret_key
PORT=5002
```

### 4. Initialize Database & Seed Data
```bash
node 07_Backend/config/initDb.js
```

### 5. Launch the Application
On Windows, simply double-click **`start_system.bat`** or run:
```bash
npm start
```

Access the application in your browser:
👉 **`http://localhost:5002`**

---

## 📱 Mobile Device GPS Access (Same Wi-Fi)

To stream authentic GPS telemetry from a smartphone:
1. Connect your phone and laptop to the same Wi-Fi network (or laptop hotspot).
2. Open the mobile network URL shown on the server terminal:
   `http://<YOUR_LAN_IP>:5002/driver.html`
3. Tap **`📱 Start Live Phone GPS`** and grant location permissions.
4. Watch the vehicle marker travel in real time on your desktop radar at `http://localhost:5002/tracking.html`!

---

## 🧪 Automated Test Suite

Run the comprehensive 18-point API, database, and telemetry test suite:
```bash
npm test
```

---

## 👩‍💻 Developer

**Kanika K**  
B.Tech in Artificial Intelligence and Data Science  
*V.S.B. Engineering College, Karur*  
GitHub: [@kanikakandasamy](https://github.com/kanikakandasamy)

---

## 📄 License
This project is licensed under the MIT License.
