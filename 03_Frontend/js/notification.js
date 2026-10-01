// ========================================================
// AI Smart Bus Tracking and Notification System
// Notification Center Controller - V2.5
// ========================================================

async function initNotificationCenter() {
    loadBusDropdown();
    loadNotifications();

    // Auto-refresh every 8 seconds
    setInterval(loadNotifications, 8000);
}

// Load Bus Dropdown from Fleet API
async function loadBusDropdown() {
    const res = await SmartBusAPI.getBuses();
    if (res.success && res.data) {
        const select = document.getElementById("bus_id");
        res.data.forEach(b => {
            const opt = document.createElement("option");
            opt.value = b.id;
            opt.innerText = `🚍 ${b.bus_number}`;
            select.appendChild(opt);
        });
    }
}

// Load Notifications Feed
async function loadNotifications() {
    const res = await SmartBusAPI.getNotifications();
    const list = document.getElementById("notificationList");

    if (res.success && res.data) {
        if (res.data.length === 0) {
            list.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px;">No broadcast announcements yet.</div>`;
            return;
        }

        list.innerHTML = res.data.map(n => {
            let badgeClass = "badge-info";
            let borderCol = "#3b82f6";
            let icon = "ℹ️";

            if (n.type === "emergency") {
                badgeClass = "badge-danger";
                borderCol = "#ef4444";
                icon = "🚨";
            } else if (n.type === "delay") {
                badgeClass = "badge-warning";
                borderCol = "#f59e0b";
                icon = "⚠️";
            } else if (n.type === "arrival") {
                badgeClass = "badge-success";
                borderCol = "#10b981";
                icon = "🚏";
            }

            const targetBus = n.bus_number ? `🚍 ${n.bus_number}` : "📢 All Buses";

            return `
                <div style="background: white; border-left: 5px solid ${borderCol}; border-radius: var(--radius-sm); padding: 16px; box-shadow: var(--shadow-sm); border-top: 1px solid var(--border-color); border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: flex-start; gap: 14px;">
                    <div>
                        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
                            <span class="badge ${badgeClass}">${icon} ${n.type ? n.type.toUpperCase() : 'ALERT'}</span>
                            <span class="badge badge-purple">${targetBus}</span>
                            <span style="font-size: 11px; color: var(--text-muted);">${new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${new Date(n.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">${n.title || 'Transit Announcement'}</h4>
                        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">${n.message}</p>
                    </div>
                    <button class="btn btn-sm btn-secondary" style="color: var(--danger); border-color: #fecaca;" onclick="deleteNotif(${n.id})">
                        Delete
                    </button>
                </div>
            `;
        }).join("");
    }
}

// Handle Form Submission
async function handleSendNotification(e) {
    e.preventDefault();

    const bus_id = document.getElementById("bus_id").value || null;
    const type = document.getElementById("notifType").value;
    const title = document.getElementById("notifTitle").value.trim();
    const message = document.getElementById("notifMessage").value.trim();

    if (!title || !message) {
        Toast.show("Validation", "Please enter both title and message.", "warning");
        return;
    }

    const payload = {
        bus_id: bus_id ? parseInt(bus_id) : null,
        type,
        title,
        message
    };

    const res = await SmartBusAPI.addNotification(payload);
    if (res.success) {
        Toast.show("Announcement Dispatched", "Alert broadcasted to all active dashboards.", "success");
        document.getElementById("notifTitle").value = "";
        document.getElementById("notifMessage").value = "";
        loadNotifications();
    } else {
        Toast.show("Dispatch Failed", res.message || "Could not publish advisory.", "danger");
    }
}

// Delete Notification
async function deleteNotif(id) {
    const res = await SmartBusAPI.deleteNotification(id);
    if (res.success) {
        Toast.show("Removed", "Advisory deleted.", "info");
        loadNotifications();
    }
}

window.addEventListener("DOMContentLoaded", initNotificationCenter);