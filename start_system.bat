@echo off
title AI Smart Bus Tracking & Telemetry System
color 0b
echo ==========================================================
echo   🚍 AI Smart Bus Tracking & Notification System (V2.6)
echo ==========================================================
echo.

cd /d "%~dp0"

echo [1/2] Verifying MySQL Database & Seed Data...
node 07_Backend/config/initDb.js
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Could not connect to MySQL database!
    echo Please make sure your MySQL server is running on port 3306.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Launching AI Smart Bus Server...
start "" http://localhost:5002
node 07_Backend/server.js
pause
