// ========================================================
// AI Smart Bus Tracking and Notification System
// Admin Dashboard Controller - V2.5
// ========================================================

async function loadAdminMetrics() {
    try {
        const [dashRes, trackRes] = await Promise.all([
            SmartBusAPI.getDashboard(),
            SmartBusAPI.getTracking()
        ]);

        if (dashRes.success && dashRes.data) {
            const d = dashRes.data;
            document.getElementById("dispTotalBuses").innerText = d.totalBuses;
            document.getElementById("dispActiveBuses").innerText = `${d.activeBuses} Active On Route`;
            document.getElementById("dispTotalDrivers").innerText = d.totalDrivers;
            document.getElementById("dispTotalStudents").innerText = d.totalStudents;
            document.getElementById("dispTotalRoutes").innerText = d.totalRoutes;
            document.getElementById("dispTotalAllocations").innerText = d.totalAllocations;
            document.getElementById("dispTotalNotifications").innerText = d.totalNotifications;
        }

        if (trackRes.success && trackRes.data) {
            renderFleetTable(trackRes.data);
        }
    } catch (err) {
        console.error("Admin Metrics Error:", err);
    }
}

function renderFleetTable(buses) {
    const tbody = document.getElementById("adminFleetTableBody");
    if (!buses || buses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center;">No fleet records available</td></tr>`;
        return;
    }

    tbody.innerHTML = buses.map(bus => {
        const occPct = Math.round(((bus.current_occupancy || 25) / (bus.capacity || 50)) * 100);

        return `
            <tr>
                <td><strong>🚍 ${bus.bus_number}</strong></td>
                <td>${bus.driver_name || "Assigned Driver"}</td>
                <td>${bus.route_name || "Campus Line"}</td>
                <td><span class="badge badge-success">${bus.status || "Active"}</span></td>
                <td><strong>${bus.speed} km/h</strong></td>
                <td style="min-width: 140px;">
                    <div style="font-size: 12px; margin-bottom: 3px;">${bus.current_occupancy || 25} / ${bus.capacity || 50} (${occPct}%)</div>
                    <div style="background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden;">
                        <div style="background: ${occPct > 85 ? 'var(--danger)' : 'var(--primary)'}; width: ${occPct}%; height: 100%;"></div>
                    </div>
                </td>
                <td>${bus.next_stop || "In Transit"}</td>
                <td><strong style="color: var(--primary);">${bus.eta_minutes || 8} mins</strong></td>
                <td>
                    <a href="tracking.html" class="btn btn-sm">Track Map</a>
                </td>
            </tr>
        `;
    }).join("");
}

// Real-Time Listener
RealtimeTelemetry.on("bus_location_update", () => {
    loadAdminMetrics();
});

window.addEventListener("DOMContentLoaded", () => {
    loadAdminMetrics();
    setInterval(loadAdminMetrics, 6000);
});