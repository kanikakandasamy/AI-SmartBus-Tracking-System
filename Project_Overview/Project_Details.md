# Project Details

## Problem Statement

College transportation systems often lack an efficient mechanism for providing students with real-time information about bus locations and arrival times. Students frequently experience long waiting periods, uncertainty due to unexpected delays, and inconvenience caused by route changes. Administrators also face challenges in monitoring bus movements and managing transportation operations effectively. To address these issues, an AI Smart Bus Tracking and Notification System is proposed to provide live GPS-based tracking, accurate estimated arrival times (ETA), and instant notifications, ensuring a safe, reliable, and efficient transportation experience.

---

## Project Objectives

The main objectives of this project are:

1. To provide real-time tracking of college buses using GPS technology.
2. To display the estimated time of arrival (ETA) for each bus.
3. To send instant notifications regarding bus arrivals, delays, and route changes.
4. To enable administrators to manage buses, routes, drivers, and student information efficiently.
5. To improve communication between students and the transport administration.
6. To reduce waiting time and enhance the overall transportation experience.

---

## Module List

### 1. User Management Module
- Student Registration
- User Login and Authentication
- Profile Management

### 2. Bus Management Module
- Add, Update, and Delete Bus Details
- Assign Drivers
- Manage Bus Capacity

### 3. Route Management Module
- Create and Manage Routes
- Assign Routes to Buses
- Manage Bus Stops

### 4. Live Bus Tracking Module
- GPS-Based Bus Tracking
- Real-Time Bus Location
- Estimated Time of Arrival (ETA)
- Live Bus Status

### 5. Notification Module
- Bus Arrival Alerts
- Delay Notifications
- Route Change Notifications
- Emergency Announcements

### 6. Admin Dashboard Module
- Monitor Bus Operations
- Manage Students and Drivers
- View Reports and Statistics
- System Administration

---

## Database Table List

### Student

| Field Name | Data Type |
|------------|-----------|
| student_id | INT |
| name | VARCHAR(100) |
| register_no | VARCHAR(20) |
| department | VARCHAR(50) |
| year | INT |
| phone | VARCHAR(15) |
| email | VARCHAR(100) |
| password | VARCHAR(100) |

### Driver

| Field Name | Data Type |
|------------|-----------|
| driver_id | INT |
| name | VARCHAR(100) |
| phone | VARCHAR(15) |
| license_no | VARCHAR(50) |

### Bus

| Field Name | Data Type |
|------------|-----------|
| bus_id | INT |
| bus_number | VARCHAR(20) |
| route_name | VARCHAR(100) |
| capacity | INT |
| driver_id | INT |

### Route

| Field Name | Data Type |
|------------|-----------|
| route_id | INT |
| route_name | VARCHAR(100) |
| start_point | VARCHAR(100) |
| end_point | VARCHAR(100) |

### Bus_Location

| Field Name | Data Type |
|------------|-----------|
| location_id | INT |
| bus_id | INT |
| latitude | DECIMAL(10,6) |
| longitude | DECIMAL(10,6) |
| speed | DECIMAL(5,2) |
| location_time | TIMESTAMP |

### Notification

| Field Name | Data Type |
|------------|-----------|
| notification_id | INT |
| student_id | INT |
| message | TEXT |
| status | VARCHAR(20) |
| sent_time | TIMESTAMP |

### Attendance

| Field Name | Data Type |
|------------|-----------|
| attendance_id | INT |
| student_id | INT |
| bus_id | INT |
| travel_date | DATE |
| boarding_time | TIME |

---

## Expected Outcome

The AI Smart Bus Tracking and Notification System will provide students with accurate real-time bus tracking, estimated arrival times, and instant notifications, reducing waiting time and improving convenience. It will enable administrators to monitor bus operations, manage transportation resources efficiently, and enhance overall service quality. The system aims to deliver a secure, reliable, and user-friendly transportation management solution for educational institutions.

---

## Technologies Used

| Component | Technology |
|-----------|------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Spring Boot (Java) |
| Database | MySQL |
| Version Control | Git & GitHub |
| Location Service | GPS |
