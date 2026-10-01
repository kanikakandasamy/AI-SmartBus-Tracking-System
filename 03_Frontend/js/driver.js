// ========================================================
// AI Smart Bus Tracking and Notification System
// Driver Telemetry Cockpit Controller - V2.5
// ========================================================

let driverBusId = 1;
let isTripActive = false;
let tripInterval = null;
let currentSpeed = 36;
let currentOccupancy = 36;

const DRIVER_WAYPOINTS = [
    { name: "Central Station Hub", status: "Departed" },
    { name: "Kilpauk Garden", status: "Departed" },
    { name: "Anna Nagar East", status: "Approaching" },
    { name: "Thirumangalam Metro", status: "Scheduled" },
    { name: "Ambattur Estate", status: "Scheduled" },
    { name: "Engineering Campus Gate", status: "Scheduled" }
];

function initDriverCockpit() {
    const user = SmartBusAPI.getCurrentUser();
    if (user && user.name) {
        document.getElementById("driverName").innerText = `Captain ${user.name}`;
    }

    renderDriverWaypoints();
    updateCockpitDisplay();
}

function updateCockpitDisplay() {
    document.getElementById("digitalSpeed").innerText = currentSpeed;
    document.getElementById("throttleVal").innerText = `${currentSpeed} km/h`;
    document.getElementById("driverSpeedSlider").value = currentSpeed;

    const label = document.getElementById("speedCruiseLabel");
    if (currentSpeed === 0) {
        label.innerText = "HALTED";
        label.style.color = "#ef4444";
    } else if (currentSpeed < 25) {
        label.innerText = "SLOW TRAFFIC";
        label.style.color = "#f59e0b";
    } else {
        label.innerText = "CRUISING";
        label.style.color = "#34d399";
    }

    document.getElementById("dispOccupancy").innerText = `${currentOccupancy} / 50`;
}

function renderDriverWaypoints() {
    const container = document.getElementById("driverWaypointsList");
    container.innerHTML = DRIVER_WAYPOINTS.map((wp, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 13px; font-weight: 600;">#${idx + 1} 🚏 ${wp.name}</div>
            <span class="badge ${wp.status === 'Departed' ? 'badge-success' : wp.status === 'Approaching' ? 'badge-warning' : 'badge-info'}">
                ${wp.status}
            </span>
        </div>
    `).join("");
}

// Toggle trip on / off
function toggleTrip() {
    const btn = document.getElementById("btnStartTrip");
    const badge = document.getElementById("tripStatusBadge");

    if (isTripActive) {
        // Stop trip
        isTripActive = false;
        clearInterval(tripInterval);
        tripInterval = null;

        btn.innerText = "▶ Start Trip & Transmit GPS";
        btn.className = "btn btn-success";
        badge.innerText = "Trip Status: Completed / Paused";
        badge.className = "badge badge-info";

        Toast.show("Trip Ended", "GPS broadcast suspended.", "info");
    } else {
        // Start trip
        isTripActive = true;
        tripInterval = setInterval(advanceDriverWaypoint, 3500);

        btn.innerText = "⏹ End / Pause Trip";
        btn.className = "btn btn-danger";
        badge.innerText = "Trip Status: Live On-Route";
        badge.className = "badge badge-success";

        Toast.show("Trip Started", "Live telemetry transmitting to student and admin portals!", "success");
    }
}

// Advance waypoint step
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
        Toast.show("GPS Coordinate Transmitted", `Reached ${d.next_stop}`, "success");
    }
}

// Speed Presets
function setSpeedPreset(speed) {
    currentSpeed = speed;
    updateCockpitDisplay();
    // Transmit new speed
    SmartBusAPI.updateTracking({
        bus_id: driverBusId,
        latitude: 13.0842,
        longitude: 80.2050,
        speed: currentSpeed
    });
}

function onSpeedSliderChange() {
    currentSpeed = parseInt(document.getElementById("driverSpeedSlider").value);
    updateCockpitDisplay();
}

// Change Passenger Occupancy
function changeOccupancy(delta) {
    currentOccupancy = Math.max(0, Math.min(50, currentOccupancy + delta));
    document.getElementById("dispOccupancy").innerText = `${currentOccupancy} / 50`;
    Toast.show("Occupancy Updated", `Current passengers: ${currentOccupancy}`, "info");
}

// Delay Modal
function openDelayModal() {
    document.getElementById("delayModal").classList.add("active");
}

function closeDelayModal() {
    document.getElementById("delayModal").classList.remove("active");
}

// Broadcast Delay Advisory
async function sendDelayAdvisory() {
    const reason = document.getElementById("delayReason").value;
    const minutes = document.getElementById("delayMinutes").value;
    const note = document.getElementById("delayCustomNote").value;

    const message = `DELAY ADVISORY: BUS-101 delayed by approx ${minutes} mins due to ${reason}. ${note}`;

    const res = await SmartBusAPI.addNotification({
        bus_id: driverBusId,
        type: "delay",
        title: "Bus Delay Advisory",
        message
    });

    if (res.success) {
        closeDelayModal();
        Toast.show("Advisory Dispatched", "Students have been alerted about the delay.", "warning");
    }
}

window.addEventListener("DOMContentLoaded", initDriverCockpit);