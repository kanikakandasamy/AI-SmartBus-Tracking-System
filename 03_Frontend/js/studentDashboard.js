// ========================================================
// AI Smart Bus Tracking and Notification System
// Student Portal Controller - V2.6
// Real-Time Telemetry & Proximity Geofencing
// ========================================================

let miniMap = null;
let miniBusMarker = null;
let miniStopMarker = null;
let studentBusId = 1;
let studentStopName = "Anna Nagar East";
let stopCoords = [13.0850, 80.2101];
let hasPlayedProximityAlert = false;
let allStudentBuses = [];

// Initialize Student Dashboard
async function initStudentDashboard() {
    const user = SmartBusAPI.getCurrentUser();
    if (user) {
        document.getElementById("studentWelcome").innerText = `Welcome, ${user.name}`;
        if (user.bus_id) studentBusId = user.bus_id;
        if (user.stop_name) studentStopName = user.stop_name;
    }

    document.getElementById("studentStopName").innerText = studentStopName;

    await loadStudentBuses();
    await resolveStopCoordinates();
    initMiniMap();
    await refreshStudentData();

    // Listen to real-time telemetry updates from SSE stream
    RealtimeTelemetry.on("bus_location_update", (updated) => {
        if (updated.bus_id === studentBusId) {
            refreshStudentData();
        }
    });

    setInterval(refreshStudentData, 5000);
}

// Load fleet buses into switcher
async function loadStudentBuses() {
    try {
        const res = await SmartBusAPI.getBuses();
        if (res.success && res.data) {
            allStudentBuses = res.data;
            const select = document.getElementById("studentBusSelect");
            if (select) {
                select.innerHTML = res.data.map(b => `
                    <option value="${b.id}" ${b.id === studentBusId ? 'selected' : ''}>
                        ${b.bus_number}
                    </option>
                `).join("");
            }
        }
    } catch (e) {
        console.warn("Could not load fleet buses for student:", e);
    }
}

function onStudentBusChange() {
    const select = document.getElementById("studentBusSelect");
    studentBusId = parseInt(select.value) || 1;
    hasPlayedProximityAlert = false;
    refreshStudentData();
    Toast.show("Bus Tracking Updated", `Now tracking Bus #${studentBusId}`, "info");
}

// Resolve coordinates of student stop dynamically from route stops
async function resolveStopCoordinates() {
    try {
        const res = await SmartBusAPI.getRoutes();
        if (res.success && res.data) {
            for (const route of res.data) {
                if (route.stops) {
                    const stops = typeof route.stops === "string" ? JSON.parse(route.stops) : route.stops;
                    const matched = stops.find(s => s.name && s.name.toLowerCase().includes(studentStopName.toLowerCase()));
                    if (matched && matched.lat && matched.lng) {
                        stopCoords = [matched.lat, matched.lng];
                        break;
                    }
                }
            }
        }
    } catch (e) {
        console.warn("Could not resolve stop coordinates:", e);
    }
}

// Mini-Map Setup
function initMiniMap() {
    if (miniMap) return;

    miniMap = L.map("studentMiniMap", {
        center: stopCoords,
        zoom: 14,
        zoomControl: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap'
    }).addTo(miniMap);

    // Student Stop Pin
    const stopIcon = L.divIcon({
        className: "custom-stop-pin",
        html: `<div style="background:#ef4444; color:white; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; font-size:16px; border:3px solid white; box-shadow:0 3px 10px rgba(0,0,0,0.3);">🚏</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    miniStopMarker = L.marker(stopCoords, { icon: stopIcon }).addTo(miniMap);
    miniStopMarker.bindPopup(`<strong>Your Boarding Stop: ${studentStopName}</strong>`);
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

        document.getElementById("cardSpeed").innerText = `${Math.round(bus.speed_kmh)} km/h`;
        document.getElementById("cardDistance").innerText = `${bus.distance_km} km`;
        document.getElementById("cardNextStop").innerText = `Next: ${bus.next_stop}`;
        document.getElementById("cardSchedule").innerText = bus.schedule_status;

        // Proximity Geofencing Alert (<= 2.5 km or <= 6 mins)
        const banner = document.getElementById("proximityBanner");
        if (bus.distance_km <= 2.5 || bus.eta_minutes <= 6) {
            banner.style.display = "block";
            document.getElementById("proximityMessage").innerText =
                `${bus.bus_number} is only ${bus.distance_km} km away! Estimated arrival in ${bus.eta_minutes} minutes at ${studentStopName}.`;

            if (!hasPlayedProximityAlert) {
                SoundAlerts.playChime();
                hasPlayedProximityAlert = true;
            }
        } else {
            banner.style.display = "none";
            hasPlayedProximityAlert = false;
        }
    }

    if (trackingRes.success && trackingRes.data) {
        const t = trackingRes.data;
        document.getElementById("studentDriverName").innerText = `${t.driver_name} (${t.driver_phone})`;

        const occ = t.current_occupancy || 0;
        const cap = t.capacity || 50;
        const remainingSeats = Math.max(0, cap - occ);
        const occRate = Math.min(100, Math.round((occ / cap) * 100));

        document.getElementById("cardOccupancy").innerText = `${remainingSeats} Seats`;
        document.getElementById("cardOccupancyDetail").innerText = `${occ} / ${cap} Filled (${occRate}%)`;

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
            if (miniStopMarker) {
                const group = new L.featureGroup([miniBusMarker, miniStopMarker]);
                miniMap.fitBounds(group.getBounds(), { padding: [40, 40], maxZoom: 15 });
            }
        }
    }

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
            <div style="background: #f8fafc; border-left: 4px solid var(--primary); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 8px;">
                <div style="font-weight: 700; font-size: 13px; color: var(--text-primary);">${n.title || 'Transit Notice'}</div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">${n.message}</div>
                <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">${new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `).join("");
    }
}

window.addEventListener("DOMContentLoaded", initStudentDashboard);
