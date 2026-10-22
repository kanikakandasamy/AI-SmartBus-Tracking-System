// ========================================================
// AI Smart Bus Tracking and Notification System
// Driver Telemetry Cockpit Controller - V2.6
// Real Mobile/Device GPS + Autonomous AI Engine
// ========================================================

let driverBusId = 1;
let isRealGpsActive = false;
let realGpsWatchId = null;
let lastGpsPosition = null;
let lastGpsTimestamp = null;
let packetCount = 0;

let isTripActive = false;
let tripInterval = null;
let currentSpeed = 0;
let currentOccupancy = 36;
let maxCapacity = 50;
let allFleetBuses = [];

let driverWaypoints = [
    { name: "Central Station Hub", status: "Departed" },
    { name: "Kilpauk Garden", status: "Departed" },
    { name: "Anna Nagar East", status: "Approaching" },
    { name: "Thirumangalam Metro", status: "Scheduled" },
    { name: "Ambattur Estate", status: "Scheduled" },
    { name: "Engineering Campus Gate", status: "Scheduled" }
];

async function initDriverCockpit() {
    const user = SmartBusAPI.getCurrentUser();
    if (user && user.name) {
        document.getElementById("driverName").innerText = `Captain ${user.name}`;
    }

    await loadFleetBuses();
    updateCockpitDisplay();
}

// Load Fleet Buses and auto-select assigned bus
async function loadFleetBuses() {
    try {
        const res = await SmartBusAPI.getBuses();
        if (res.success && res.data && res.data.length > 0) {
            allFleetBuses = res.data;
            const select = document.getElementById("driverBusSelect");
            select.innerHTML = res.data.map(b => `
                <option value="${b.id}" ${b.id === driverBusId ? 'selected' : ''}>
                    ${b.bus_number}
                </option>
            `).join("");

            // Try to match logged in driver
            const user = SmartBusAPI.getCurrentUser();
            if (user && user.id) {
                const assigned = res.data.find(b => b.driver_id === user.id);
                if (assigned) {
                    driverBusId = assigned.id;
                    select.value = assigned.id;
                }
            }

            syncSelectedBusDetails();
        }
    } catch (e) {
        console.error("Error loading fleet buses:", e);
    }
}

// When bus selection changes in cockpit
function onDriverBusChange() {
    const select = document.getElementById("driverBusSelect");
    driverBusId = parseInt(select.value) || 1;
    syncSelectedBusDetails();
    Toast.show("Bus Selected", `Switched active transmitter to Bus #${driverBusId}`, "info");
}

function syncSelectedBusDetails() {
    const bus = allFleetBuses.find(b => b.id === driverBusId);
    if (bus) {
        document.getElementById("driverBusNumber").innerText = bus.bus_number;
        document.getElementById("driverRouteName").innerText = bus.route_name || "Campus Express Corridor";
        currentOccupancy = bus.current_occupancy || 0;
        maxCapacity = bus.capacity || 50;
        document.getElementById("dispOccupancy").innerText = `${currentOccupancy} / ${maxCapacity}`;
    }
}

function updateCockpitDisplay() {
    document.getElementById("digitalSpeed").innerText = Math.round(currentSpeed);
    const throttle = document.getElementById("throttleVal");
    if (throttle) throttle.innerText = `${Math.round(currentSpeed)} km/h`;
    const slider = document.getElementById("driverSpeedSlider");
    if (slider) slider.value = Math.round(currentSpeed);

    const label = document.getElementById("speedCruiseLabel");
    if (currentSpeed <= 0) {
        label.innerText = "HALTED";
        label.style.color = "#ef4444";
    } else if (currentSpeed < 25) {
        label.innerText = "SLOW TRAFFIC";
        label.style.color = "#f59e0b";
    } else {
        label.innerText = "CRUISING";
        label.style.color = "#34d399";
    }

    document.getElementById("dispOccupancy").innerText = `${currentOccupancy} / ${maxCapacity}`;
}

// ----------------------------------------------------
// 📱 REAL-TIME MOBILE / DEVICE GPS TELEMETRY
// ----------------------------------------------------
function toggleRealGpsTracking() {
    if (isRealGpsActive) {
        stopRealGpsTracking();
    } else {
        startRealGpsTracking();
    }
}

function startRealGpsTracking() {
    if (!navigator.geolocation) {
        Toast.show("GPS Unsupported", "Geolocation is not supported by your browser.", "danger");
        return;
    }

    // Stop simulation if running
    if (isTripActive) toggleTrip();

    isRealGpsActive = true;
    packetCount = 0;

    const btn = document.getElementById("btnRealGps");
    btn.innerText = "⏹ Stop Phone GPS";
    btn.className = "btn btn-danger";

    const badge = document.getElementById("trackingSourceBadge");
    badge.innerText = "📡 Mobile Device GPS";
    badge.className = "badge badge-success";

    const tripBadge = document.getElementById("tripStatusBadge");
    tripBadge.innerText = "Trip Status: 🟢 Real GPS Live";
    tripBadge.className = "badge badge-success";

    const panel = document.getElementById("realGpsPanel");
    if (panel) panel.style.display = "block";

    Toast.show("GPS Activated", "Acquiring satellite lock from your device...", "info");

    const geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
    };

    realGpsWatchId = navigator.geolocation.watchPosition(
        handleRealGpsSuccess,
        handleRealGpsError,
        geoOptions
    );
}

function stopRealGpsTracking() {
    if (realGpsWatchId !== null) {
        navigator.geolocation.clearWatch(realGpsWatchId);
        realGpsWatchId = null;
    }

    isRealGpsActive = false;

    const btn = document.getElementById("btnRealGps");
    btn.innerText = "📱 Start Live Phone GPS";
    btn.className = "btn btn-success";

    const badge = document.getElementById("trackingSourceBadge");
    badge.innerText = "Idle";
    badge.className = "badge badge-info";

    const tripBadge = document.getElementById("tripStatusBadge");
    tripBadge.innerText = "Trip Status: Completed / Paused";
    tripBadge.className = "badge badge-info";

    const panel = document.getElementById("realGpsPanel");
    if (panel) panel.style.display = "none";

    currentSpeed = 0;
    updateCockpitDisplay();
    Toast.show("GPS Stopped", "Live device telemetry broadcast suspended.", "info");
}

async function handleRealGpsSuccess(position) {
    const coords = position.coords;
    const lat = coords.latitude;
    const lng = coords.longitude;
    const accuracy = coords.accuracy || 5;
    const now = Date.now();

    // Calculate speed
    if (coords.speed !== null && coords.speed !== undefined && !isNaN(coords.speed)) {
        currentSpeed = Math.max(0, coords.speed * 3.6); // m/s to km/h
    } else if (lastGpsPosition && lastGpsTimestamp) {
        // Delta calculation fallback
        const distKm = computeHaversine(lastGpsPosition.lat, lastGpsPosition.lng, lat, lng);
        const hours = (now - lastGpsTimestamp) / 3600000;
        if (hours > 0 && distKm < 0.5) { // filter out unrealistic GPS jumps
            currentSpeed = Math.min(80, (distKm / hours));
        }
    }

    // Heading calculation
    let heading = coords.heading || 0;
    if ((!heading || isNaN(heading)) && lastGpsPosition) {
        heading = computeBearing(lastGpsPosition.lat, lastGpsPosition.lng, lat, lng);
    }

    lastGpsPosition = { lat, lng };
    lastGpsTimestamp = now;
    packetCount++;

    // Update Real GPS Panel
    const dispCoords = document.getElementById("dispRealCoords");
    if (dispCoords) dispCoords.innerText = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    const dispAcc = document.getElementById("dispRealAccuracy");
    if (dispAcc) dispAcc.innerText = `± ${Math.round(accuracy)}m`;

    const dispPackets = document.getElementById("dispPacketCount");
    if (dispPackets) dispPackets.innerText = packetCount;

    updateCockpitDisplay();

    // Transmit to Backend Real-Time API
    try {
        const res = await SmartBusAPI.updateTracking({
            bus_id: driverBusId,
            latitude: lat,
            longitude: lng,
            speed: Math.round(currentSpeed),
            heading: Math.round(heading),
            accuracy: Math.round(accuracy)
        });

        if (res.success && res.data) {
            const d = res.data;
            if (d.next_stop) document.getElementById("dispNextStop").innerText = d.next_stop;
            if (d.distance_remaining_km !== undefined) document.getElementById("dispDistance").innerText = `${d.distance_remaining_km} km`;
            if (d.eta_minutes !== undefined) document.getElementById("dispETA").innerText = `ETA: ~ ${d.eta_minutes} mins`;
            if (d.traffic_level) document.getElementById("dispTraffic").innerText = d.traffic_level;
        }
    } catch (err) {
        console.error("Telemetry transmission error:", err);
    }
}

function handleRealGpsError(err) {
    console.warn("GPS Location error:", err.message);
    let msg = "Could not retrieve GPS coordinates.";
    if (err.code === 1) msg = "Location permission denied. Please allow GPS access in your browser settings.";
    else if (err.code === 2) msg = "GPS satellite signal unavailable. Please ensure Location is enabled.";
    else if (err.code === 3) msg = "GPS request timed out. Retrying...";
    Toast.show("GPS Warning", msg, "warning");
}

// ----------------------------------------------------
// 🤖 ROUTE SIMULATION ENGINE (FOR DESK TESTING)
// ----------------------------------------------------
function toggleTrip() {
    const btn = document.getElementById("btnStartTrip");
    const badge = document.getElementById("tripStatusBadge");
    const sourceBadge = document.getElementById("trackingSourceBadge");

    if (isTripActive) {
        isTripActive = false;
        clearInterval(tripInterval);
        tripInterval = null;

        btn.innerText = "🤖 Run Route Simulation";
        btn.className = "btn btn-secondary";
        badge.innerText = "Trip Status: Completed / Paused";
        badge.className = "badge badge-info";
        sourceBadge.innerText = "Idle";
        sourceBadge.className = "badge badge-info";

        Toast.show("Simulation Ended", "GPS broadcast suspended.", "info");
    } else {
        if (isRealGpsActive) stopRealGpsTracking();

        isTripActive = true;
        tripInterval = setInterval(advanceDriverWaypoint, 3500);

        btn.innerText = "⏹ Pause Simulation";
        btn.className = "btn btn-danger";
        badge.innerText = "Trip Status: 🤖 Simulating On-Route";
        badge.className = "badge badge-success";
        sourceBadge.innerText = "🤖 Route Simulation";
        sourceBadge.className = "badge badge-purple";

        Toast.show("Simulation Started", "Bus telemetry advancing along route waypoints.", "success");
    }
}

async function advanceDriverWaypoint() {
    const res = await SmartBusAPI.simulateStep(driverBusId);
    if (res.success && res.data) {
        const d = res.data;
        document.getElementById("dispNextStop").innerText = d.next_stop;
        document.getElementById("dispDistance").innerText = `${d.distance_remaining_km} km`;
        document.getElementById("dispETA").innerText = `ETA: ~ ${d.eta_minutes} mins`;
        document.getElementById("dispTraffic").innerText = d.traffic_level;

        currentSpeed = Math.round(d.speed);
        updateCockpitDisplay();
    }
}

// Speed Presets
function setSpeedPreset(speed) {
    currentSpeed = speed;
    updateCockpitDisplay();

    // If currently simulating or stationary, send updated speed
    SmartBusAPI.updateTracking({
        bus_id: driverBusId,
        latitude: lastGpsPosition ? lastGpsPosition.lat : 13.0842,
        longitude: lastGpsPosition ? lastGpsPosition.lng : 80.2050,
        speed: currentSpeed
    });
}

function onSpeedSliderChange() {
    currentSpeed = parseInt(document.getElementById("driverSpeedSlider").value);
    updateCockpitDisplay();
}

// ----------------------------------------------------
// 👥 PASSENGER OCCUPANCY SYNCHRONIZATION
// ----------------------------------------------------
async function changeOccupancy(delta) {
    currentOccupancy = Math.max(0, Math.min(maxCapacity, currentOccupancy + delta));
    document.getElementById("dispOccupancy").innerText = `${currentOccupancy} / ${maxCapacity}`;

    try {
        await SmartBusAPI.saveBus({ current_occupancy: currentOccupancy }, driverBusId);
        Toast.show("Occupancy Synced", `Passengers onboard: ${currentOccupancy} / ${maxCapacity}`, "info");
    } catch (e) {
        console.error("Failed to sync occupancy:", e);
    }
}

// ----------------------------------------------------
// 📢 DELAY ADVISORY BROADCAST
// ----------------------------------------------------
function openDelayModal() {
    document.getElementById("delayModal").classList.add("active");
}

function closeDelayModal() {
    document.getElementById("delayModal").classList.remove("active");
}

async function sendDelayAdvisory() {
    const reason = document.getElementById("delayReason").value;
    const minutes = document.getElementById("delayMinutes").value;
    const note = document.getElementById("delayCustomNote").value;

    const busNumber = document.getElementById("driverBusNumber").innerText;
    const message = `DELAY ADVISORY: ${busNumber} delayed by approx ${minutes} mins due to ${reason}. ${note}`;

    const res = await SmartBusAPI.addNotification({
        bus_id: driverBusId,
        type: "delay",
        title: "Bus Delay Advisory",
        message
    });

    if (res.success) {
        closeDelayModal();
        Toast.show("Advisory Dispatched", "Students along your route have been alerted.", "warning");
    }
}

// Helper math functions
function computeHaversine(lat1, lon1, lat2, lon2) {
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

function computeBearing(startLat, startLng, destLat, destLng) {
    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    const brng = Math.atan2(y, x);
    return ((brng * 180 / Math.PI) + 360) % 360;
}

window.addEventListener("DOMContentLoaded", initDriverCockpit);
