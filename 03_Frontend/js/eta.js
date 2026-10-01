// ========================================================
// AI Smart Bus Tracking and Notification System
// Advanced AI ETA Engine Client Controller - V2.5
// ========================================================

let etaData = [];
let selectedBusId = 1;

// Load ETA predictions from Backend
async function loadETAPredictions() {
    const res = await SmartBusAPI.getETA();
    if (res.success && res.data) {
        etaData = res.data;
        populateBusSelector();
        updateSelectedBusDisplay();
        renderFleetETATable();
    }
}

// Populate the Bus Dropdown
function populateBusSelector() {
    const select = document.getElementById("selectBusETA");
    select.innerHTML = etaData.map(b => `
        <option value="${b.bus_id}" ${b.bus_id === selectedBusId ? "selected" : ""}>
            🚍 ${b.bus_number}
        </option>
    `).join("");
}

// Dropdown change handler
function onBusSelectionChange() {
    const select = document.getElementById("selectBusETA");
    selectedBusId = parseInt(select.value) || 1;
    updateSelectedBusDisplay();
}

// Update the top hero card and breakdown factors for selected bus
function updateSelectedBusDisplay() {
    const bus = etaData.find(b => b.bus_id === selectedBusId) || etaData[0];
    if (!bus) return;

    // Hero banner
    document.getElementById("heroBusTitle").innerText = `${bus.bus_number} — ${bus.route_name}`;
    document.getElementById("heroBusRoute").innerText = `En route towards ${bus.destination}. Currently near ${bus.next_stop}.`;
    document.getElementById("heroTrafficLevel").innerText = `${bus.traffic_condition} (${bus.traffic_factor}x)`;
    document.getElementById("heroConfidence").innerText = `${bus.ai_confidence_score} High Precision`;
    document.getElementById("heroDistance").innerText = `${bus.distance_km} km`;
    document.getElementById("heroNextStop").innerText = bus.next_stop;

    document.getElementById("heroETAMinutes").innerText = bus.eta_minutes;
    document.getElementById("heroClockTime").innerText = `Arrives ~ ${bus.predicted_arrival_time}`;

    // Mathematical factors
    document.getElementById("factorDistance").innerText = `${bus.distance_km} km`;
    document.getElementById("factorTraffic").innerText = `${bus.traffic_factor}x Multiplier`;
    document.getElementById("factorDwell").innerText = `+${(bus.remaining_stops * 1.5).toFixed(1)} mins`;
    document.getElementById("factorSpeed").innerText = `${bus.effective_speed_kmh} km/h Effective`;

    // Stop-by-stop schedule table
    renderStopTimelineTable(bus.stop_timeline);
}

// Render stop-by-stop timeline table
function renderStopTimelineTable(timeline) {
    const tbody = document.getElementById("stopTimelineTableBody");
    if (!timeline || timeline.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No stops defined for this route.</td></tr>`;
        return;
    }

    tbody.innerHTML = timeline.map((stop, idx) => {
        const isNext = idx === 1;
        const isPassed = idx === 0;

        return `
            <tr style="background: ${isNext ? '#f0fdf4' : 'transparent'};">
                <td><strong>#${stop.sequence}</strong></td>
                <td>
                    <span style="font-weight: 700; color: ${isNext ? 'var(--primary)' : 'inherit'};">
                        🚏 ${stop.name}
                    </span>
                    ${isNext ? '<span class="badge badge-success" style="margin-left: 8px;">Next Stop</span>' : ''}
                </td>
                <td>${stop.distance_km} km</td>
                <td><strong>${stop.predicted_time}</strong></td>
                <td><span class="badge ${isNext ? 'badge-warning' : 'badge-info'}">${stop.eta_minutes} mins</span></td>
                <td>
                    <span class="badge ${isPassed ? 'badge-success' : isNext ? 'badge-warning' : 'badge-info'}">
                        ${isPassed ? 'Departed' : isNext ? 'Approaching' : 'Scheduled'}
                    </span>
                </td>
            </tr>
        `;
    }).join("");
}

// Render Fleet-Wide ETA Summary
function renderFleetETATable() {
    const tbody = document.getElementById("fleetETATableBody");
    if (!etaData || etaData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center;">No fleet records available</td></tr>`;
        return;
    }

    tbody.innerHTML = etaData.map(bus => `
        <tr>
            <td><strong>🚍 ${bus.bus_number}</strong></td>
            <td>${bus.route_name}</td>
            <td><strong>${bus.speed_kmh} km/h</strong></td>
            <td><span class="badge ${bus.traffic_condition.includes('Heavy') ? 'badge-danger' : 'badge-warning'}">${bus.traffic_condition}</span></td>
            <td>${bus.distance_km} km</td>
            <td><strong style="color: var(--primary); font-size: 15px;">${bus.eta_minutes} mins</strong></td>
            <td>${bus.predicted_arrival_time}</td>
            <td><span class="badge badge-success">${bus.ai_confidence_score}</span></td>
            <td>
                <a href="tracking.html" class="btn btn-sm">Track Map</a>
            </td>
        </tr>
    `).join("");
}

// Interactive Scenario Simulator
async function runInteractiveSimulation() {
    const distance_km = parseFloat(document.getElementById("simDist").value);
    const speed_kmh = parseFloat(document.getElementById("simSpeed").value);
    const traffic_condition = document.getElementById("simTraffic").value;
    const remaining_stops = parseInt(document.getElementById("simStops").value);

    // Update labels
    document.getElementById("valDist").innerText = `${distance_km} km`;
    document.getElementById("valSpeed").innerText = `${speed_kmh} km/h`;

    const res = await SmartBusAPI.simulateETA({
        distance_km,
        speed_kmh,
        traffic_condition,
        remaining_stops
    });

    if (res.success && res.simulation) {
        const s = res.simulation;
        document.getElementById("simOutputETA").innerText = `${s.predicted_eta_minutes} mins`;
        document.getElementById("simOutputClock").innerText = `~ ${s.predicted_arrival_time}`;
        document.getElementById("simOutputConf").innerText = `${s.confidence} Conf`;
        document.getElementById("simOutputAdvisory").innerText = s.advisory;
    }
}

// Real-Time Listeners
RealtimeTelemetry.on("bus_location_update", () => {
    loadETAPredictions();
});

// Boot on Load
window.addEventListener("DOMContentLoaded", () => {
    loadETAPredictions();
    runInteractiveSimulation();

    // Auto-refresh every 6 seconds
    setInterval(loadETAPredictions, 6000);
});