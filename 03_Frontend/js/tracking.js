// ========================================================
// AI Smart Bus Tracking and Notification System
// Live Map & Telemetry Controller - V2.5
// ========================================================

let map = null;
let busMarkers = {};
let routePolyline = null;
let stopMarkers = [];
let allBuses = [];
let selectedBusId = 1;
let autoSimulateInterval = null;

// Route waypoints definitions for polyline rendering
const ROUTE_COORDINATES = {
    1: [
        [13.0827, 80.2707], // Central Station
        [13.0818, 80.2550], // Periamet
        [13.0812, 80.2405], // Kilpauk
        [13.0830, 80.2250], // Shenoy Nagar
        [13.0850, 80.2101], // Anna Nagar East
        [13.0835, 80.1925], // Thirumangalam Metro
        [13.0900, 80.1770], // Mogappair
        [13.0980, 80.1620], // Ambattur Estate
        [13.1145, 80.1410]  // Engineering Campus
    ],
    2: [
        [12.9304, 80.1250], // Tambaram
        [12.9516, 80.1412], // Chromepet
        [12.9675, 80.1500], // Pallavaram
        [12.9810, 80.1780], // Airport
        [13.0067, 80.2025], // Guindy
        [13.1145, 80.1410]  // Engineering Campus
    ]
};

const ROUTE_STOPS_META = {
    1: [
        { name: "Central Station", lat: 13.0827, lng: 80.2707, time: "Departed" },
        { name: "Kilpauk Garden", lat: 13.0812, lng: 80.2405, time: "Departed" },
        { name: "Anna Nagar East", lat: 13.0850, lng: 80.2101, time: "Approaching" },
        { name: "Thirumangalam Metro", lat: 13.0835, lng: 80.1925, time: "+6 mins" },
        { name: "Ambattur Estate", lat: 13.0980, lng: 80.1620, time: "+14 mins" },
        { name: "Engineering Campus Gate", lat: 13.1145, lng: 80.1410, time: "+22 mins" }
    ],
    2: [
        { name: "Tambaram Hub", lat: 12.9304, lng: 80.1250, time: "Departed" },
        { name: "Chromepet Station", lat: 12.9516, lng: 80.1412, time: "Departed" },
        { name: "Guindy Industrial", lat: 13.0067, lng: 80.2025, time: "+11 mins" },
        { name: "Engineering Campus Gate", lat: 13.1145, lng: 80.1410, time: "+25 mins" }
    ]
};

// Initialize Leaflet Map
function initMap() {
    if (map) return;

    map = L.map("map", {
        center: [13.0850, 80.2101],
        zoom: 13,
        zoomControl: true
    });

    // High quality OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(map);

    renderRoutePolyline(selectedBusId);
    renderStops(selectedBusId);
}

// Render Route Polyline
function renderRoutePolyline(busId) {
    if (routePolyline) {
        map.removeLayer(routePolyline);
    }

    const path = ROUTE_COORDINATES[busId] || ROUTE_COORDINATES[1];
    routePolyline = L.polyline(path, {
        color: "#4f46e5",
        weight: 5,
        opacity: 0.85,
        dashArray: "8, 6"
    }).addTo(map);
}

// Render Stop Waypoint Markers
function renderStops(busId) {
    stopMarkers.forEach(m => map.removeLayer(m));
    stopMarkers = [];

    const stops = ROUTE_STOPS_META[busId] || ROUTE_STOPS_META[1];
    stops.forEach((stop, idx) => {
        const isDestination = idx === stops.length - 1;
        const iconHtml = `<div style="background:${isDestination ? '#10b981' : '#ffffff'}; color:${isDestination ? '#fff' : '#4f46e5'}; border: 2px solid #4f46e5; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${idx + 1}</div>`;

        const stopIcon = L.divIcon({
            className: "stop-marker-icon",
            html: iconHtml,
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });

        const marker = L.marker([stop.lat, stop.lng], { icon: stopIcon }).addTo(map);
        marker.bindPopup(`
            <div style="font-family: sans-serif; min-width: 150px;">
                <div style="font-weight: 800; color: #0f172a; margin-bottom: 4px;">🚏 ${stop.name}</div>
                <div style="font-size: 12px; color: #64748b;">Stop #${idx + 1}</div>
                <div style="font-size: 12px; color: #4f46e5; font-weight: 700; margin-top: 4px;">Status: ${stop.time}</div>
            </div>
        `);
        stopMarkers.push(marker);
    });
}

// Update or Create Bus Marker on Map
function updateBusMarker(bus) {
    const busId = bus.bus_id || bus.id;
    const isSelected = busId === selectedBusId;
    const lat = parseFloat(bus.latitude) || 13.0850;
    const lng = parseFloat(bus.longitude) || 80.2101;

    const iconHtml = `
        <div style="position: relative;">
            ${isSelected ? '<div class="bus-radar"></div>' : ''}
            <div class="bus-marker-icon" style="background:${isSelected ? '#4f46e5' : '#0284c7'}; transform: rotate(${bus.heading || 0}deg);">
                🚍
            </div>
        </div>
    `;

    const busIcon = L.divIcon({
        className: "custom-bus-icon",
        html: iconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    if (busMarkers[busId]) {
        busMarkers[busId].setLatLng([lat, lng]);
        busMarkers[busId].setIcon(busIcon);
    } else {
        const marker = L.marker([lat, lng], { icon: busIcon }).addTo(map);
        marker.on("click", () => selectBus(busId));
        busMarkers[busId] = marker;
    }

    busMarkers[busId].bindPopup(`
        <div style="font-family: sans-serif; min-width: 180px;">
            <div style="font-weight: 800; font-size: 15px; color: #4f46e5;">🚍 ${bus.bus_number}</div>
            <div style="font-size: 12px; color: #334155; margin-top: 4px;">Driver: <strong>${bus.driver_name || "N/A"}</strong></div>
            <div style="font-size: 12px; color: #334155;">Speed: <strong>${bus.speed} km/h</strong></div>
            <div style="font-size: 12px; color: #334155;">Next Stop: <strong>${bus.next_stop}</strong></div>
            <div style="margin-top: 6px;">
                <span class="badge badge-success">ETA: ${bus.eta_minutes} mins</span>
            </div>
        </div>
    `);
}

// Select a bus to inspect
function selectBus(busId) {
    selectedBusId = busId;

    // Update bus chip styles
    document.querySelectorAll(".bus-chip").forEach(chip => {
        chip.classList.toggle("active", parseInt(chip.dataset.busId) === busId);
    });

    renderRoutePolyline(busId);
    renderStops(busId);

    const bus = allBuses.find(b => (b.bus_id || b.id) === busId);
    if (bus) {
        updateHUD(bus);
        updateSidebar(bus);
        centerOnBus();
    }
}

// Update floating HUD elements
function updateHUD(bus) {
    document.getElementById("hudBusName").innerText = bus.bus_number || `BUS #${bus.bus_id}`;
    document.getElementById("hudSpeed").innerText = `${bus.speed || 0} km/h`;
    document.getElementById("hudETA").innerText = `${bus.eta_minutes || 8} mins`;

    const trafficEl = document.getElementById("hudTraffic");
    const traffic = bus.traffic_level || "Normal";
    trafficEl.innerText = traffic;
    trafficEl.className = "badge " + (traffic === "Heavy" ? "badge-danger" : traffic === "Moderate" ? "badge-warning" : "badge-success");
}

// Update right sidebar telemetry
function updateSidebar(bus) {
    document.getElementById("sidebarDriver").innerText = bus.driver_name || "Assigned Driver";
    document.getElementById("sidebarDriverPhone").innerText = bus.driver_phone || "+91 98451 23456";
    document.getElementById("sidebarRoute").innerText = bus.route_name || "North Express";
    document.getElementById("sidebarDistance").innerText = `${bus.distance_remaining_km || 4.5} km`;

    // Occupancy
    const occ = bus.current_occupancy || 25;
    const cap = bus.capacity || 50;
    const pct = Math.round((occ / cap) * 100);
    document.getElementById("occupancyText").innerText = `${occ} / ${cap} Seats (${pct}%)`;
    document.getElementById("occupancyBar").style.width = `${pct}%`;

    // Stops timeline
    renderTimelineList(bus);
}

// Render sidebar stops list
function renderTimelineList(bus) {
    const container = document.getElementById("stopsTimeline");
    const stops = ROUTE_STOPS_META[selectedBusId] || ROUTE_STOPS_META[1];
    document.getElementById("totalStopsCount").innerText = `${stops.length} Stops`;

    let html = "";
    stops.forEach((stop, idx) => {
        const isNext = stop.name.toLowerCase().includes((bus.next_stop || "").toLowerCase()) || idx === 2;
        const isPassed = idx < 2;

        html += `
            <div class="timeline-item ${isNext ? 'active' : ''} ${isPassed ? 'passed' : ''}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4>${stop.name}</h4>
                    <p>
                        <span>${isPassed ? 'Passed' : isNext ? 'Approaching Now' : 'Scheduled'}</span>
                        <strong style="color: ${isNext ? 'var(--primary)' : 'inherit'}">${isPassed ? 'Done' : stop.time}</strong>
                    </p>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Center camera on the selected bus
function centerOnBus() {
    if (!map) return;
    const bus = allBuses.find(b => (b.bus_id || b.id) === selectedBusId);
    if (bus && bus.latitude && bus.longitude) {
        map.flyTo([bus.latitude, bus.longitude], 14, { duration: 1.2 });
    }
}

// Fit map bounds to encompass the entire route
function fitFullRoute() {
    if (!map || !routePolyline) return;
    map.fitBounds(routePolyline.getBounds(), { padding: [50, 50] });
}

// Render bottom telemetry table
function renderTable(buses) {
    const tbody = document.getElementById("trackingTableBody");
    if (!buses || buses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;">No tracking data available</td></tr>`;
        return;
    }

    tbody.innerHTML = buses.map(bus => `
        <tr style="cursor: pointer;" onclick="selectBus(${bus.bus_id || bus.id})">
            <td><strong>🚍 ${bus.bus_number}</strong></td>
            <td><span class="badge badge-success">${bus.status || 'Active'}</span></td>
            <td>${bus.driver_name || 'Driver'}</td>
            <td><code>${bus.latitude ? bus.latitude.toFixed(4) : '-'}, ${bus.longitude ? bus.longitude.toFixed(4) : '-'}</code></td>
            <td><strong>${bus.speed} km/h</strong></td>
            <td><span class="badge ${bus.traffic_level === 'Heavy' ? 'badge-danger' : 'badge-warning'}">${bus.traffic_level || 'Normal'}</span></td>
            <td>${bus.next_stop || 'Main Gate'}</td>
            <td><strong style="color: var(--primary);">${bus.eta_minutes} mins</strong></td>
            <td>
                <button class="btn btn-sm" onclick="event.stopPropagation(); selectBus(${bus.bus_id || bus.id}); centerOnBus();">
                    Track
                </button>
            </td>
        </tr>
    `).join("");
}

// Render Bus Selector Chips
function renderBusChips(buses) {
    const container = document.getElementById("busChipsContainer");
    container.innerHTML = buses.map(b => `
        <div class="bus-chip ${(b.bus_id || b.id) === selectedBusId ? 'active' : ''}"
             data-bus-id="${b.bus_id || b.id}"
             onclick="selectBus(${b.bus_id || b.id})">
            🚍 ${b.bus_number.split(" ")[0]}
        </div>
    `).join("");
}

// Fetch and load initial tracking data
async function refreshTrackingData() {
    const res = await SmartBusAPI.getTracking();
    if (res.success && res.data) {
        allBuses = res.data;
        renderBusChips(allBuses);
        renderTable(allBuses);

        allBuses.forEach(updateBusMarker);

        const current = allBuses.find(b => (b.bus_id || b.id) === selectedBusId) || allBuses[0];
        if (current) {
            updateHUD(current);
            updateSidebar(current);
        }
    }
}

// Advance simulation by 1 step
async function stepSimulation() {
    const res = await SmartBusAPI.simulateStep(selectedBusId);
    if (res.success) {
        Toast.show("GPS Step Transmitted", res.message, "success");
        refreshTrackingData();
    }
}

// Toggle continuous automatic GPS movement
function toggleAutoSimulate() {
    const btn = document.getElementById("btnToggleSimulate");
    if (autoSimulateInterval) {
        clearInterval(autoSimulateInterval);
        autoSimulateInterval = null;
        btn.innerText = "▶ Start Live Simulation";
        btn.classList.remove("btn-danger");
        btn.classList.add("btn-secondary");
        Toast.show("Simulation Paused", "Manual tracking active.", "info");
    } else {
        autoSimulateInterval = setInterval(stepSimulation, 3500);
        btn.innerText = "⏹ Pause Live Simulation";
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-danger");
        Toast.show("Simulation Active", "Bus moving along route in real-time.", "success");
    }
}

// Real-Time SSE Event Listeners
RealtimeTelemetry.on("bus_location_update", (updated) => {
    const busId = updated.bus_id;
    const idx = allBuses.findIndex(b => (b.bus_id || b.id) === busId);
    if (idx !== -1) {
        allBuses[idx] = { ...allBuses[idx], ...updated };
        updateBusMarker(allBuses[idx]);

        if (busId === selectedBusId) {
            updateHUD(allBuses[idx]);
            updateSidebar(allBuses[idx]);
        }
        renderTable(allBuses);
    }
});

RealtimeTelemetry.on("initial_state", (data) => {
    allBuses = data;
    renderBusChips(allBuses);
    renderTable(allBuses);
    allBuses.forEach(updateBusMarker);
});

// Boot Tracking on Load
window.addEventListener("DOMContentLoaded", () => {
    initMap();
    refreshTrackingData();

    // Fallback sync polling every 5 seconds
    setInterval(refreshTrackingData, 5000);
});