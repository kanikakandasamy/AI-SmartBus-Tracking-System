// ========================================================
// AI Smart Bus Tracking and Notification System
// Live Map & Autonomous Telemetry Controller - V2.6
// ========================================================

let map = null;
let busMarkers = {};
let routePolyline = null;
let stopMarkers = [];
let allBuses = [];
let allRoutes = [];
let allAllocations = [];
let selectedBusId = 1;
let autoSimulateInterval = null;
let userLocationMarker = null;
let busBreadcrumbs = {}; // busId -> L.polyline
let busHistory = {}; // busId -> [[lat, lng], ...]

// Default fallback paths for demo routes
const DEFAULT_ROUTE_PATHS = {
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
    ],
    3: [
        [13.0382, 80.1565], // Porur Toll
        [13.0450, 80.1380], // Iyyappanthangal
        [13.0510, 80.0950], // Poonamallee Bypass
        [13.1145, 80.1410]  // Engineering Campus
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

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(map);
}

// Load metadata from API
async function loadMetadata() {
    try {
        const [routesRes, allocRes] = await Promise.all([
            SmartBusAPI.getRoutes(),
            SmartBusAPI.getAllocations()
        ]);

        if (routesRes.success && routesRes.data) allRoutes = routesRes.data;
        if (allocRes.success && allocRes.data) allAllocations = allocRes.data;
    } catch (e) {
        console.warn("Failed to load routes/allocations:", e);
    }
}

// Get stops for a specific bus
function getStopsForBus(busId) {
    const alloc = allAllocations.find(a => a.bus_id === busId);
    let route = null;
    if (alloc) {
        route = allRoutes.find(r => r.id === alloc.route_id);
    }
    if (!route && allRoutes.length > 0) {
        route = allRoutes.find(r => r.id === busId) || allRoutes[0];
    }

    if (route && route.stops) {
        try {
            const parsed = typeof route.stops === "string" ? JSON.parse(route.stops) : route.stops;
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
    }

    // Default stops fallback
    return [
        { name: "Central Station Hub", lat: 13.0827, lng: 80.2707, sequence: 1 },
        { name: "Kilpauk Garden", lat: 13.0812, lng: 80.2405, sequence: 2 },
        { name: "Anna Nagar East", lat: 13.0850, lng: 80.2101, sequence: 3 },
        { name: "Thirumangalam Metro", lat: 13.0835, lng: 80.1925, sequence: 4 },
        { name: "Ambattur Estate", lat: 13.0980, lng: 80.1620, sequence: 5 },
        { name: "Engineering Campus Gate", lat: 13.1145, lng: 80.1410, sequence: 6 }
    ];
}

// Render Route Polyline
function renderRoutePolyline(busId) {
    if (routePolyline) {
        map.removeLayer(routePolyline);
        routePolyline = null;
    }

    let path = DEFAULT_ROUTE_PATHS[busId];
    if (!path) {
        const stops = getStopsForBus(busId);
        if (stops.length > 1) {
            path = stops.map(s => [s.lat, s.lng]);
        }
    }
    if (!path || path.length === 0) path = DEFAULT_ROUTE_PATHS[1];

    routePolyline = L.polyline(path, {
        color: "#4f46e5",
        weight: 5,
        opacity: 0.85,
        dashArray: "8, 6"
    }).addTo(map);
}

// Render Stop Markers
function renderStops(busId) {
    stopMarkers.forEach(m => map.removeLayer(m));
    stopMarkers = [];

    const stops = getStopsForBus(busId);
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
                <div style="font-size: 12px; color: #64748b;">Stop #${idx + 1} of ${stops.length}</div>
                <div style="font-size: 12px; color: #4f46e5; font-weight: 700; margin-top: 4px;">Status: Scheduled Waypoint</div>
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

    // Breadcrumb path recording
    if (!busHistory[busId]) busHistory[busId] = [];
    busHistory[busId].push([lat, lng]);
    if (busHistory[busId].length > 30) busHistory[busId].shift();

    // Render breadcrumb polyline
    if (!busBreadcrumbs[busId]) {
        busBreadcrumbs[busId] = L.polyline(busHistory[busId], {
            color: isSelected ? "#38bdf8" : "#94a3b8",
            weight: 3,
            opacity: 0.6
        }).addTo(map);
    } else {
        busBreadcrumbs[busId].setLatLngs(busHistory[busId]);
        busBreadcrumbs[busId].setStyle({ color: isSelected ? "#38bdf8" : "#94a3b8" });
    }

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
        <div style="font-family: sans-serif; min-width: 190px;">
            <div style="font-weight: 800; font-size: 15px; color: #4f46e5;">🚍 ${bus.bus_number}</div>
            <div style="font-size: 12px; color: #334155; margin-top: 4px;">Driver: <strong>${bus.driver_name || "Assigned Driver"}</strong></div>
            <div style="font-size: 12px; color: #334155;">Speed: <strong>${bus.speed} km/h</strong></div>
            <div style="font-size: 12px; color: #334155;">Next Stop: <strong>${bus.next_stop || "In Transit"}</strong></div>
            <div style="margin-top: 6px; display: flex; gap: 6px;">
                <span class="badge badge-success">ETA: ${bus.eta_minutes || 10} mins</span>
                <span class="badge badge-info">${bus.distance_remaining_km || 4.5} km</span>
            </div>
        </div>
    `);
}

// Select a bus to inspect
function selectBus(busId) {
    selectedBusId = busId;

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
    document.getElementById("hudSpeed").innerText = `${Math.round(bus.speed || 0)} km/h`;
    document.getElementById("hudETA").innerText = `${bus.eta_minutes || 8} mins`;

    const trafficEl = document.getElementById("hudTraffic");
    const traffic = bus.traffic_level || "Normal";
    trafficEl.innerText = `${traffic} Traffic`;
    trafficEl.className = "badge " + (traffic === "Heavy" ? "badge-danger" : traffic === "Moderate" ? "badge-warning" : "badge-success");
}

// Update right sidebar telemetry
function updateSidebar(bus) {
    document.getElementById("sidebarDriver").innerText = bus.driver_name || "Assigned Driver";
    document.getElementById("sidebarDriverPhone").innerText = bus.driver_phone || "+91 98451 23456";
    document.getElementById("sidebarRoute").innerText = bus.route_name || "Campus Express";
    document.getElementById("sidebarDistance").innerText = `${bus.distance_remaining_km || 4.5} km`;

    // Occupancy
    const occ = bus.current_occupancy || 0;
    const cap = bus.capacity || 50;
    const pct = Math.min(100, Math.round((occ / cap) * 100));
    document.getElementById("occupancyText").innerText = `${occ} / ${cap} Seats (${pct}%)`;
    document.getElementById("occupancyBar").style.width = `${pct}%`;

    renderTimelineList(bus);
}

// Render sidebar stops list
function renderTimelineList(bus) {
    const container = document.getElementById("stopsTimeline");
    const stops = getStopsForBus(selectedBusId);
    document.getElementById("totalStopsCount").innerText = `${stops.length} Stops`;

    let html = "";
    stops.forEach((stop, idx) => {
        const isNext = (bus.next_stop && stop.name.toLowerCase().includes(bus.next_stop.toLowerCase())) || idx === 2;
        const isPassed = idx < 2;

        html += `
            <div class="timeline-item ${isNext ? 'active' : ''} ${isPassed ? 'passed' : ''}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4>${stop.name}</h4>
                    <p>
                        <span>${isPassed ? 'Departed' : isNext ? 'Approaching Now' : 'Scheduled'}</span>
                        <strong style="color: ${isNext ? 'var(--primary)' : 'inherit'}">${isPassed ? 'Done' : `Stop #${idx + 1}`}</strong>
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

// Passenger / User Geolocation
function locateUser() {
    if (!navigator.geolocation) {
        Toast.show("Geolocation", "Your browser does not support location services.", "warning");
        return;
    }

    Toast.show("Locating You", "Pinpointing your device location...", "info");

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const uLat = pos.coords.latitude;
            const uLng = pos.coords.longitude;

            const userIcon = L.divIcon({
                className: "user-loc-pin",
                html: `<div style="background:#0284c7; color:white; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; font-size:16px; border:3px solid white; box-shadow:0 0 15px rgba(2,132,199,0.8);">📍</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });

            if (userLocationMarker) {
                userLocationMarker.setLatLng([uLat, uLng]);
            } else {
                userLocationMarker = L.marker([uLat, uLng], { icon: userIcon }).addTo(map);
            }

            const currentBus = allBuses.find(b => (b.bus_id || b.id) === selectedBusId);
            let distText = "";
            if (currentBus && currentBus.latitude && currentBus.longitude) {
                const distToBus = haversineLocal(uLat, uLng, currentBus.latitude, currentBus.longitude);
                distText = `<br><span style="color:#4f46e5; font-weight:700;">Distance to ${currentBus.bus_number}: ${distToBus.toFixed(2)} km</span>`;
            }

            userLocationMarker.bindPopup(`<strong>Your Location</strong>${distText}`).openPopup();
            map.flyTo([uLat, uLng], 14, { duration: 1.2 });
            Toast.show("Location Found", "Centered map on your current location.", "success");
        },
        (err) => {
            Toast.show("Location Error", "Could not get your position. Please allow location permissions.", "warning");
        },
        { enableHighAccuracy: true, timeout: 8000 }
    );
}

function haversineLocal(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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
            <td><strong>${Math.round(bus.speed)} km/h</strong></td>
            <td><span class="badge ${bus.traffic_level === 'Heavy' ? 'badge-danger' : 'badge-warning'}">${bus.traffic_level || 'Normal'}</span></td>
            <td>${bus.next_stop || 'Main Gate'}</td>
            <td><strong style="color: var(--primary);">${bus.eta_minutes || 8} mins</strong></td>
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
    } else {
        allBuses.push(updated);
        updateBusMarker(updated);
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
window.addEventListener("DOMContentLoaded", async () => {
    initMap();
    await loadMetadata();
    await refreshTrackingData();

    // Select first bus by default
    if (allBuses.length > 0) {
        selectBus(allBuses[0].bus_id || allBuses[0].id);
    }

    // Fallback sync polling every 5 seconds
    setInterval(refreshTrackingData, 5000);
});
