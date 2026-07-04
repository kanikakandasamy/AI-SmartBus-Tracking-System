# Database Description - AI Smart Bus Tracking System

## Overview
The SmartBusDB database is designed to support an AI-based bus tracking and notification system for college transportation. It stores information about users, buses, routes, live bus locations, student allocations, and notifications.

---

## 1. Users Table
Stores all system users including students, drivers, and admin.

**Purpose:**
- Authentication and role management
- Stores login credentials and contact details

---

## 2. Route Table
Defines bus routes used by the transportation system.

**Purpose:**
- Stores route name, start point, and end point
- Linked with buses and bus stops

---

## 3. Bus Table
Stores details of each bus in the fleet.

**Purpose:**
- Tracks bus number and capacity
- Links each bus to a driver and route

---

## 4. BusStop Table
Stores all stops under a specific route.

**Purpose:**
- Defines stop order for each route
- Stores GPS coordinates for tracking

---

## 5. BusLocation Table
Stores real-time location data of buses.

**Purpose:**
- Enables live tracking system
- Stores latitude, longitude, and speed
- Used for map visualization and ETA prediction

---

## 6. BusAllocation Table
Maps students to buses and routes.

**Purpose:**
- Assigns students to specific buses
- Helps in managing transport eligibility

---

## 7. Notifications Table
Stores system-generated alerts.

**Purpose:**
- Sends updates to students (bus delay, arrival, etc.)
- Tracks message status (sent/read)

---

## Relationships Summary
- Users → Bus (driver relationship)
- Route → Bus / BusStop
- Bus → BusLocation
- Users → Notifications
- Users → BusAllocation

---

## Conclusion
This database is optimized for real-time bus tracking, student transport management, and notification delivery in a college environment.
