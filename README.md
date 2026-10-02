

````markdown
# 🚌 AI Smart Bus Tracking and Notification System

<p align="center">
  <b>Real-Time College Bus Tracking • AI-Based ETA Prediction • Smart Notifications</b>
</p>

<p align="center">
  A web-based transportation management system designed to simplify college bus operations, provide live tracking information, estimate bus arrival times, and manage transportation notifications.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JavaScript-orange" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express.js-green" alt="Backend">
  <img src="https://img.shields.io/badge/Database-MySQL-blue" alt="Database">
  <img src="https://img.shields.io/badge/Real--Time-SSE-purple" alt="Real-Time">
  <img src="https://img.shields.io/badge/Authentication-JWT-red" alt="Authentication">
</p>

---

## 📌 Overview

The **AI Smart Bus Tracking and Notification System** is a web-based college transportation management platform developed to improve and simplify transportation operations.

The system provides a centralized platform for managing:

- Buses
- Drivers
- Students
- Routes
- Bus allocations
- Live tracking
- Notifications
- AI-based ETA prediction

The application uses **HTML, CSS, JavaScript, Node.js, Express.js, and MySQL**.

Real-time communication is supported using **Server-Sent Events (SSE)**, while authentication is implemented using **JSON Web Tokens (JWT)**.

The system provides a foundation that can be extended in the future with GPS integration, advanced machine learning, traffic information, mobile applications, and other intelligent transportation features.

---

## 🎯 Objectives

- 🚌 Efficiently manage college transportation
- 📍 Provide live bus tracking information
- 🤖 Estimate bus arrival time
- 👨‍✈️ Manage driver information
- 🎓 Manage student transportation details
- 🛣️ Manage routes
- 🔄 Manage bus allocations
- 🔔 Provide transportation notifications
- 🆘 Provide SOS functionality
- 📊 Provide a centralized administration dashboard
- 🔐 Provide secure authentication
- ⚡ Support real-time telemetry updates

---

# ✨ Key Features

## 🔐 Secure Authentication

- User login system
- JWT-based authentication
- Password hashing
- Protected API access
- Authentication middleware

## 🚌 Bus Management

- Add and manage buses
- Maintain bus information
- View available buses
- Update bus details
- Assign buses to routes

## 👨‍✈️ Driver Management

- Add driver information
- Manage driver details
- Associate drivers with buses
- Maintain driver assignments

## 🎓 Student Management

- Maintain student information
- Manage student transportation details
- Associate students with transportation services

## 🛣️ Route Management

- Create and manage routes
- Maintain route information
- View available routes
- Allocate buses to routes

## 🔄 Bus Allocation

- Assign buses to routes
- Manage transportation assignments
- Maintain bus-route relationships

## 📍 Live Bus Tracking

The live tracking module provides continuously updated bus telemetry information.

Features include:

- Bus tracking information
- Real-time telemetry updates
- Bus speed monitoring
- Server-Sent Events (SSE)
- Continuous tracking updates

## 🤖 AI-Based ETA Prediction

The system provides an estimated arrival time using available bus telemetry information.

Basic ETA calculation:

```text
ETA = Remaining Distance / Current Speed
````

The ETA module provides a foundation for future intelligent transportation prediction.

Future versions can incorporate:

* GPS data
* Traffic conditions
* Historical travel data
* Weather conditions
* Road conditions
* Machine learning models

---

## 🔔 Notifications

The notification module provides transportation-related information and updates.

It can be used for:

* Bus updates
* Route notifications
* Transportation alerts
* Important announcements

---

## 🆘 SOS Support

The system includes an SOS functionality for transportation-related emergency situations.

---

## 📊 Admin Dashboard

The administration dashboard provides centralized access to important transportation information such as:

* Total buses
* Total drivers
* Total students
* Total routes
* Bus allocations
* Notifications

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │     User / Admin    │
                         │     Web Browser     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Frontend Interface │
                         │   HTML / CSS / JS   │
                         └──────────┬──────────┘
                                    │
                              HTTP / SSE
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Node.js + Express  │
                         │     Backend API     │
                         └──────────┬──────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
        ┌──────────────┐    ┌───────────────┐   ┌────────────────┐
        │Authentication│    │ ETA Prediction│   │ Live Tracking  │
        │ & Security   │    │    Engine     │   │& Notifications │
        └──────────────┘    └───────────────┘   └────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    MySQL Database   │
                         └─────────────────────┘
```

---

# 🧩 System Modules

| Module                  | Description                               |
| ----------------------- | ----------------------------------------- |
| 🔐 Authentication       | Secure login and user authentication      |
| 🚌 Bus Management       | Add, update, and manage buses             |
| 👨‍✈️ Driver Management | Manage driver information and assignments |
| 🎓 Student Management   | Manage student transportation details     |
| 🛣️ Route Management    | Create and manage transportation routes   |
| 🔄 Bus Allocation       | Allocate buses to routes                  |
| 📍 Live Tracking        | Monitor real-time bus telemetry           |
| 🤖 AI ETA Prediction    | Estimate bus arrival time                 |
| 🔔 Notifications        | Send transportation-related updates       |
| 🆘 SOS                  | Support transportation emergency alerts   |
| 📊 Admin Dashboard      | Centralized transportation management     |

---

# 🛠️ Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript

## Backend

* Node.js
* Express.js

## Database

* MySQL

## Real-Time Communication

* Server-Sent Events (SSE)

## Authentication & Security

* JSON Web Tokens (JWT)
* Password Hashing

## Development Tools

* Visual Studio Code
* MySQL Workbench
* XAMPP
* Postman
* Git
* GitHub

---

# 📁 Project Structure

```text
AI_SmartBus_Tracking_System/
│
├── 01_Documentation/
│
├── 02_Database/
│
├── 03_Frontend/
│
├── 07_Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── test_endpoints.js
│
├── .gitignore
├── package-lock.json
└── README.md
```

> `node_modules/` and `.env` are excluded from the GitHub repository.

---

# ⚙️ Installation and Setup

## 1. Clone the Repository

```bash
git clone https://github.com/kanikakandasamy/AI-SmartBus-Tracking-System.git
```

Navigate to the project:

```bash
cd AI-SmartBus-Tracking-System
```

---

## 2. Install Backend Dependencies

Navigate to the backend:

```bash
cd 07_Backend
```

Install the required dependencies:

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the `07_Backend` folder.

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=ai_smart_bus
DB_PORT=3306

JWT_SECRET=your_secure_secret_key

PORT=5002
```

> **Important:** Do not upload `.env` files or database credentials to GitHub.

---

## 4. Configure MySQL Database

Create the database:

```sql
CREATE DATABASE ai_smart_bus;
```

Select the database:

```sql
USE ai_smart_bus;
```

Use the SQL files available in:

```text
02_Database/
```

Make sure the MySQL server is running before starting the backend.

---

## 5. Start the Backend Server

From the `07_Backend` directory:

```bash
npm start
```

The backend server runs on:

```text
http://localhost:5002
```

The web application can be accessed through:

```text
http://localhost:5002/index.html
```

---

# 🔗 API Services

The backend provides API endpoints for different modules.

Examples include:

```text
/api/auth
/api/buses
/api/drivers
/api/students
/api/routes
/api/allocations
/api/tracking
/api/notifications
/api/eta
```

---

## 📡 Live Telemetry Stream

The system supports real-time telemetry using Server-Sent Events (SSE).

```text
/api/tracking/stream
```

---

## 🤖 AI ETA Service

The ETA functionality is available through:

```text
/api/eta
```

---

# 🔐 Security

The system includes security mechanisms such as:

* JWT-based authentication
* Password hashing
* Protected API routes
* Authentication middleware
* Environment variable configuration
* `.env` exclusion through `.gitignore`

Sensitive credentials should never be committed to the GitHub repository.

---

# 🚀 Future Enhancements

The system can be further enhanced with advanced transportation technologies.

Possible future enhancements include:

* 🗺️ Google Maps integration
* 📡 GPS-based live bus tracking
* 📱 Android and iOS mobile applications
* 🔔 Push notifications
* 🤖 Advanced machine learning-based ETA prediction
* 🚦 Traffic-aware ETA prediction
* 🌦️ Weather-based prediction
* 📊 Transportation analytics and reports
* 🚌 Multiple vehicle tracking
* 🎫 QR-based student attendance
* ☁️ Cloud deployment
* 📈 Historical travel analysis

---

# 🌐 Deployment

The application can be deployed using cloud hosting platforms.

The general deployment architecture is:

```text
                    ┌───────────────────┐
                    │    User Browser   │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   Cloud Server    │
                    │ Node.js + Express │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    Cloud MySQL    │
                    └───────────────────┘
```

The frontend and backend can communicate through the same application origin, making the application suitable for cloud deployment.

---

---

# 📌 Project Highlights

* 🚍 College transportation management
* 📍 Live bus tracking support
* 🤖 AI-based ETA prediction
* 🔔 Transportation notification system
* 🆘 SOS functionality
* 🔐 JWT authentication
* ⚡ Server-Sent Events for real-time updates
* 🗄️ MySQL database integration
* 📊 Centralized admin dashboard
* 🌐 Cloud deployment ready
* 📈 Extensible architecture for future GPS and ML integration

---

# 👩‍💻 Developer

**Kanika K**

B.Tech in Artificial Intelligence and Data Science
V.S.B. Engineering College, Karur

GitHub:
[https://github.com/kanikakandasamy](https://github.com/kanikakandasamy)

---

# 📄 License

This project is developed for educational and academic purposes.

```
```
