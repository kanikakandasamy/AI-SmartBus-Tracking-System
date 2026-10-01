// ========================================================
// AI Smart Bus Tracking and Notification System
// Core Real-Time API & Client Library - V2.5
// ========================================================

const API_BASE = (window.location.origin && window.location.origin.startsWith("http"))
    ? window.location.origin
    : "http://localhost:5002";

// Sound Synthesizer via Web Audio API (Zero external MP3 dependencies)
const SoundAlerts = {
    audioCtx: null,
    init() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.audioCtx = new AudioContext();
        }
    },
    playChime() {
        try {
            this.init();
            if (!this.audioCtx) return;
            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.45);
        } catch (e) { console.warn("Audio chime ignored:", e); }
    },
    playEmergencySiren() {
        try {
            this.init();
            if (!this.audioCtx) return;
            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.linearRampToValueAtTime(400, now + 0.2);
            osc.frequency.linearRampToValueAtTime(800, now + 0.4);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.55);
        } catch (e) { console.warn("Audio siren ignored:", e); }
    }
};

// Modern Toast Notification Manager
const Toast = {
    container: null,
    init() {
        if (!this.container) {
            this.container = document.createElement("div");
            this.container.className = "toast-container";
            document.body.appendChild(this.container);
        }
    },
    show(title, message, type = "info") {
        this.init();
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;

        let icon = "ℹ️";
        if (type === "success") { icon = "✅"; SoundAlerts.playChime(); }
        else if (type === "warning") { icon = "⚠️"; SoundAlerts.playChime(); }
        else if (type === "emergency" || type === "danger") { icon = "🚨"; SoundAlerts.playEmergencySiren(); }

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-body">
                <h5>${title}</h5>
                <p>${message}</p>
            </div>
        `;

        this.container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(100%)";
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
};

// API Services
const SmartBusAPI = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
        const token = localStorage.getItem("smartbus_token");
        if (token) headers["Authorization"] = `Bearer ${token}`;

        try {
            const res = await fetch(url, { ...options, headers });
            const data = await res.json();
            return data;
        } catch (err) {
            console.error(`API Error on ${endpoint}:`, err);
            return { success: false, message: "Network connection error", error: err.message };
        }
    },

    // Health
    getHealth() { return this.request("/api/health"); },

    // Dashboard
    getDashboard() { return this.request("/api/dashboard"); },

    // Tracking
    getTracking() { return this.request("/api/tracking"); },
    getBusTracking(busId) { return this.request(`/api/tracking/${busId}`); },
    updateTracking(data) { return this.request("/api/tracking", { method: "POST", body: JSON.stringify(data) }); },
    simulateStep(busId = 1) { return this.request("/api/tracking/simulate-step", { method: "POST", body: JSON.stringify({ bus_id: busId }) }); },
    sendSOS(data) { return this.request("/api/tracking/sos", { method: "POST", body: JSON.stringify(data) }); },

    // ETA
    getETA(stop = "") { return this.request(`/api/eta${stop ? `?stop=${encodeURIComponent(stop)}` : ""}`); },
    getBusETA(busId, stop = "") { return this.request(`/api/eta/${busId}${stop ? `?stop=${encodeURIComponent(stop)}` : ""}`); },
    simulateETA(payload) { return this.request("/api/eta/simulate", { method: "POST", body: JSON.stringify(payload) }); },

    // Notifications
    getNotifications() { return this.request("/api/notifications"); },
    addNotification(payload) { return this.request("/api/notifications", { method: "POST", body: JSON.stringify(payload) }); },
    deleteNotification(id) { return this.request(`/api/notifications/${id}`, { method: "DELETE" }); },

    // Buses
    getBuses() { return this.request("/api/buses"); },
    getBus(id) { return this.request(`/api/buses/${id}`); },
    saveBus(data, id = null) {
        return this.request(id ? `/api/buses/${id}` : "/api/buses", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(data)
        });
    },
    deleteBus(id) { return this.request(`/api/buses/${id}`, { method: "DELETE" }); },

    // Drivers
    getDrivers() { return this.request("/api/drivers"); },
    getDriver(id) { return this.request(`/api/drivers/${id}`); },
    saveDriver(data, id = null) {
        return this.request(id ? `/api/drivers/${id}` : "/api/drivers", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(data)
        });
    },
    deleteDriver(id) { return this.request(`/api/drivers/${id}`, { method: "DELETE" }); },

    // Routes
    getRoutes() { return this.request("/api/routes"); },
    getRoute(id) { return this.request(`/api/routes/${id}`); },
    saveRoute(data, id = null) {
        return this.request(id ? `/api/routes/${id}` : "/api/routes", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(data)
        });
    },
    deleteRoute(id) { return this.request(`/api/routes/${id}`, { method: "DELETE" }); },

    // Students
    getStudents() { return this.request("/api/students"); },
    getStudent(id) { return this.request(`/api/students/${id}`); },
    saveStudent(data, id = null) {
        return this.request(id ? `/api/students/${id}` : "/api/students", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(data)
        });
    },
    deleteStudent(id) { return this.request(`/api/students/${id}`, { method: "DELETE" }); },

    // Allocations
    getAllocations() { return this.request("/api/allocations"); },
    saveAllocation(data) { return this.request("/api/allocations", { method: "POST", body: JSON.stringify(data) }); },
    deleteAllocation(id) { return this.request(`/api/allocations/${id}`, { method: "DELETE" }); },

    // Auth
    async login(email, password, role = "admin") {
        const res = await this.request("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password, role })
        });
        if (res.success && res.token) {
            localStorage.setItem("smartbus_token", res.token);
            localStorage.setItem("smartbus_user", JSON.stringify(res.user));
            localStorage.setItem("smartbus_role", res.role);
        }
        return res;
    },

    logout() {
        localStorage.removeItem("smartbus_token");
        localStorage.removeItem("smartbus_user");
        localStorage.removeItem("smartbus_role");
        window.location.href = "login.html";
    },

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem("smartbus_user") || "null");
        } catch (e) { return null; }
    }
};

// Real-Time SSE Stream Manager
const RealtimeTelemetry = {
    eventSource: null,
    listeners: [],
    latestBuses: [],

    connect() {
        if (window.EventSource && !this.eventSource) {
            try {
                this.eventSource = new EventSource(`${API_BASE}/api/tracking/stream`);

                this.eventSource.addEventListener("initial_state", (e) => {
                    const data = JSON.parse(e.data);
                    this.latestBuses = data;
                    this.notify("initial_state", data);
                });

                this.eventSource.addEventListener("bus_location_update", (e) => {
                    const data = JSON.parse(e.data);
                    this.updateBusCache(data);
                    this.notify("bus_location_update", data);
                });

                this.eventSource.addEventListener("emergency_sos", (e) => {
                    const data = JSON.parse(e.data);
                    Toast.show("🚨 EMERGENCY SOS ALERT", `${data.sender_name}: ${data.message}`, "emergency");
                    this.notify("emergency_sos", data);
                });

                this.eventSource.onerror = () => {
                    console.warn("⚠️ SSE stream disconnected, will fallback to polling.");
                    this.eventSource.close();
                    this.eventSource = null;
                    setTimeout(() => this.connect(), 8000);
                };
            } catch (err) {
                console.error("SSE Connection error:", err);
            }
        }
    },

    updateBusCache(updated) {
        const idx = this.latestBuses.findIndex(b => b.bus_id === updated.bus_id || b.id === updated.bus_id);
        if (idx !== -1) {
            this.latestBuses[idx] = { ...this.latestBuses[idx], ...updated };
        } else {
            this.latestBuses.push(updated);
        }
    },

    on(eventType, callback) {
        this.listeners.push({ eventType, callback });
    },

    notify(eventType, data) {
        this.listeners
            .filter(l => l.eventType === eventType || l.eventType === "*")
            .forEach(l => l.callback(data));
    }
};

// Global Emergency SOS Trigger Helper
function triggerEmergencySOS(busId = 1) {
    const user = SmartBusAPI.getCurrentUser();
    const senderName = user ? user.name : "Passenger";

    if (confirm("🚨 ARE YOU SURE YOU WANT TO BROADCAST AN EMERGENCY SOS ALERT?")) {
        SmartBusAPI.sendSOS({
            bus_id: busId,
            sender_name: senderName,
            message: "Immediate medical or roadside emergency requested!"
        }).then(res => {
            if (res.success) {
                Toast.show("SOS DISPATCHED", "Emergency responders and campus security have been notified.", "emergency");
            }
        });
    }
}

// Auto-initialize real-time stream
RealtimeTelemetry.connect();