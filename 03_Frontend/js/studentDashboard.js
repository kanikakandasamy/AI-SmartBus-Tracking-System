// ========================================================
// AI Smart Bus Tracking and Notification System
// Student Portal Controller - V2.5
// ========================================================

let miniMap = null;
let miniBusMarker = null;
let miniStopMarker = null;
let studentBusId = 1;
let studentStopName = "Anna Nagar East";
let stopCoords = [13.0850, 80.2101];

// Initialize Student Dashboard
async function initStudentDashboard() {
    const user = SmartBusAPI.getCurrentUser();
    if (user) {
        document.getElementById("studentWelcome").innerText = `Welcome, ${user.name}`;
        if (user.bus_id) studentBusId = user.bus_id;
        if (user.stop_name) studentStopName = user.stop_name;
    }

    document.getElementById("studentStopName").innerText = studentStopName;

    initMiniMap();
    await refreshStudentData();

    // Listen to real-time telemetry updates
    RealtimeTelemetry.on("bus_location_update", (updated) => {
        if (updated.bus_id === studentBusId) {
            refreshStudentData();
        }
    });

    setInterval(refreshStudentData, 5000);
}

// Mini-Map Setup
function initMiniMap() {
    if (miniMap) return;

    miniMap = L.map("studentMiniMap", {
        center: [13.0850, 80.2101],
        zoom: 14,
        zoomControl: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap'
    }).addTo(miniMap);

    // Student Stop Pin
    const stopIcon = L.divIcon({
        className: "custom-stop-pin",
        html: `<div style="background:#ef4444; color:white; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-size:16px; border:3px solid white; box-shadow:0 3px 10px rgba(0,0,0,0.3);">🚏</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    miniStopMarker = L.marker(stopCoords, { icon: stopIcon }).addTo(miniMap);
    miniStopMarker.bindPopup(`<strong>Your Stop: ${studentStopName}</strong>`);
}

// Fetch Bus & ETA Data for Student
async function refreshStudentData() {
    const etaRes = await SmartBusAPI.getBusETA(studentBusId, studentStopName);
    const trackingRes = await SmartBusAPI.getBusTracking(studentBusId);

    if (etaRes.success && etaRes.data) {
        const bus = etaRes.data;

        document.getElementById("studentBusName").innerText = bus.bus_number;
        document.getElementById("studentRouteName").innerText = bus.route_name;
        document.getElementById("studentTraffic").innerText = bus.traffic_condition;
        document.getElementById("studentETACountdown").innerText = `${bus.eta_minutes} mins`;
        document.getElementById("studentArrivalClock").innerText = `~ ${bus.predicted_arrival_time}`;

        document.getElementById("cardSpeed").innerText = `${bus.speed_kmh} km/h`;
        document.getElementById("cardDistance").innerText = `${bus.distance_km} km`;
        document.getElementById("cardNextStop").innerText = `Next: ${bus.next_stop}`;
        document.getElementById("cardSchedule").innerText = bus.schedule_status;

        // Proximity Geofencing Alert (<= 2 km or <= 5 mins)
        const banner = document.getElementById("proximityBanner");
        if (bus.distance_km <= 2.5 || bus.eta_minutes <= 6) {
            banner.style.display = "block";
            document.getElementById("proximityMessage").innerText =
                `${bus.bus_number} is only ${bus.distance_km} km away! Estimated arrival in ${bus.eta_minutes} minutes at ${studentStopName}.`;
        } else {
            banner.style.display = "none";
        }
    }

    if (trackingRes.success && trackingRes.data) {
        const t = trackingRes.data;
        document.getElementById("studentDriverName").innerText = `${t.driver_name} (${t.driver_phone})`;

        const remainingSeats = (t.capacity || 50) - (t.current_occupancy || 25);
        document.getElementById("cardOccupancy").innerText = `${remainingSeats} Seats`;
        document.getElementById("cardOccupancyDetail").innerText = `${t.current_occupancy} / ${t.capacity} Filled (${t.occupancy_rate}%)`;

        // Update Mini-Map Bus Marker
        if (miniMap && t.latitude && t.longitude) {
            const busIcon = L.divIcon({
                className: "mini-bus-icon",
                html: `<div style="background:#4f46e5; color:white; border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; font-size:16px; border:2px solid white; box-shadow:0 3px 10px rgba(79,70,229,0.5);">🚍</div>`,
                iconSize: [34, 34],
                iconAnchor: [17, 17]
            });

            if (miniBusMarker) {
                miniBusMarker.setLatLng([t.latitude, t.longitude]);
            } else {
                miniBusMarker = L.marker([t.latitude, t.longitude], { icon: busIcon }).addTo(miniMap);
            }

            // Fit both bus and stop on mini-map
            const group = new L.featureGroup([miniBusMarker, miniStopMarker]);
            miniMap.fitBounds(group.getBounds(), { padding: [40, 40], maxZoom: 15 });
        }
    }

    // Load recent notifications
    loadStudentAlerts();
}

// Load Alerts for Student
async function loadStudentAlerts() {
    const notifRes = await SmartBusAPI.getNotifications();
    const container = document.getElementById("studentAlertsContainer");

    if (notifRes.success && notifRes.data) {
        const busAlerts = notifRes.data.filter(n => !n.bus_id || n.bus_id === studentBusId).slice(0, 4);

        if (busAlerts.length === 0) {
            container.innerHTML = `<div style="color: var(--text-muted); font-size: 13px;">No active alerts for your bus.</div>`;
            return;
        }

        container.innerHTML = busAlerts.map(n => `
            <div style="background: #f8fafc; border-left: 4px solid var(--primary); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <div style="font-weight: 700; font-size: 13px; color: var(--text-primary);">${n.title || 'Transit Notice'}</div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">${n.message}</div>
                <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">${new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `).join("");
    }
}

window.addEventListener("DOMContentLoaded", initStudentDashboard);
