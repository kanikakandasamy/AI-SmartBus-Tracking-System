# 🚌 AI Smart Bus Tracking and Notification System

An intelligent web-based bus tracking system that enables students and administrators to monitor buses in real time, manage transportation resources, send notifications, and estimate bus arrival times using AI-based ETA prediction.

---

## 📌 Project Overview

The AI Smart Bus Tracking and Notification System is designed to improve college transportation management. It allows administrators to manage buses, drivers, students, routes, and allocations while providing students with real-time bus tracking, notifications, and estimated arrival times.

---

## ✨ Features

- 🔐 Secure Login System
- 🚌 Bus Management
- 👨‍✈️ Driver Management
- 👨‍🎓 Student Management
- 🛣️ Route Management
- 📋 Bus Allocation
- 📍 Live Bus Tracking
- 🔔 Notification Management
- 🤖 AI ETA Prediction
- 📊 Admin Dashboard with Live Statistics

---

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Development Tools
- Visual Studio Code
- MySQL Workbench
- XAMPP
- Git & GitHub
- Postman

---

## 📂 Project Structure

```
AI-SmartBus-Tracking-System
│
├── Frontend/
│   ├── html/
│   ├── css/
│   └── js/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── Database/
│   └── ai_smart_bus.sql
│
├── README.md
└── .gitignore
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/kanikakandasamy/AI-SmartBus-Tracking-System.git
```

### 2. Open the project

```bash
cd AI-SmartBus-Tracking-System
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend folder.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ai_smart_bus
PORT=5002
JWT_SECRET=your_secret_key
```

### 5. Import Database

Import the `ai_smart_bus.sql` file into MySQL using MySQL Workbench or phpMyAdmin.

### 6. Start the Server

```bash
npm start
```

or

```bash
node server.js
```

### 7. Open the Application

```
http://localhost:5002
```

---

## 📸 Modules

- Login
- Bus Management
- Driver Management
- Student Management
- Route Management
- Bus Allocation
- Live Tracking
- Notifications
- AI ETA Prediction
- Admin Dashboard

---

## 🤖 AI ETA Prediction

The system estimates the arrival time of buses using:

```
ETA = Remaining Distance ÷ Current Speed
```

The predicted ETA is displayed in minutes to help students know when the bus is expected to arrive.

---

## 🎯 Advantages

- Real-time bus monitoring
- Faster transportation management
- AI-based arrival prediction
- Improved communication through notifications
- Easy management of buses, drivers, and students
- User-friendly interface

---

## 🔮 Future Enhancements

- Google Maps integration
- Live GPS tracking
- Mobile application (Android/iOS)
- Push notifications
- QR Code based attendance
- Machine Learning based traffic prediction

---

## 👩‍💻 Developed By

**Kanika Kandasamy**

B.Tech – Artificial Intelligence & Data Science

---

## 📄 License

This project is developed for educational and academic purposes.
