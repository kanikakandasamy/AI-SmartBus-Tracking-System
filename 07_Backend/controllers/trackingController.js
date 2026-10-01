// ============================================
// AI Smart Bus Tracking and Notification System
// Real-Time Telemetry & SSE Streaming Controller
// controllers/trackingController.js
// ============================================

const db = require("../config/db");

// Connected Server-Sent Events (SSE) clients
const sseClients = new Set();

// Broadcast event to all connected SSE clients
function broadcastSSE(eventType, data) {
    const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
    sseClients.forEach(client => {
        try {
            client.res.write(payload);
        } catch (err) {
            console.error("SSE send error, removing client:", err.message);
            sseClients.delete(client);
        }
    });
}

// Format tracking records with enriched data
function enrichTrackingRecord(row) {
    return {
        id: row.id,
        bus_id: row.bus_id,
        bus_number: row.bus_number,
        driver_name: row.driver_name || "Assigned Driver",
        driver_phone: row.driver_phone || "N/A",
        route_name: row.route_name || "Campus Line",
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        speed: parseFloat(row.speed) || 0,
        heading: parseFloat(row.heading) || 0,
        traffic_level: row.traffic_level || "Normal",
        next_stop: row.next_stop || "Next Station",
        distance_remaining_km: parseFloat(row.distance_remaining_km) || 4.5,
        eta_minutes: parseInt(row.eta_minutes) || 10,
        capacity: row.capacity || 50,
        current_occupancy: row.current_occupancy || 25,
        occupancy_rate: Math.round(((row.current_occupancy || 25) / (row.capacity || 50)) * 100),
        status: row.status || "Active",
        updated_at: row.updated_at
    };
}

// GET /api/tracking - Get latest tracking positions for all active buses
exports.getTracking = (req, res) => {
    const sql = `
        SELECT
            t.id,
            t.bus_id,
            b.bus_number,
            b.capacity,
            b.current_occupancy,
            b.status,
            d.name AS driver_name,
            d.phone AS driver_phone,
            r.route_name,
            r.stops,
            t.latitude,
            t.longitude,
            t.speed,
            t.heading,
            t.traffic_level,
            t.next_stop,
            t.distance_remaining_km,
            t.eta_minutes,
            t.updated_at
        FROM tracking t
        JOIN buses b ON t.bus_id = b.id
        LEFT JOIN drivers d ON b.driver_id = d.id
        LEFT JOIN allocations a ON b.id = a.bus_id
        LEFT JOIN routes r ON a.route_id = r.id
        INNER JOIN (
            SELECT bus_id, MAX(id) AS max_id
            FROM tracking
            GROUP BY bus_id
        ) latest ON t.id = latest.max_id
        ORDER BY b.id ASC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Tracking query error:", err.message);
            return res.status(500).json({ success: false, error: err.message });
        }

        const data = result.map(enrichTrackingRecord);
        res.json({
            success: true,
            count: data.length,
            data
        });
    });
};

// GET /api/tracking/:busId - Single bus position
exports.getBusTracking = (req, res) => {
    const busId = req.params.busId;
    const sql = `
        SELECT
            t.id,
            t.bus_id,
            b.bus_number,
            b.capacity,
            b.current_occupancy,
            b.status,
            d.name AS driver_name,
            d.phone AS driver_phone,
            r.route_name,
            r.stops,
            t.latitude,
            t.longitude,
            t.speed,
            t.heading,
            t.traffic_level,
            t.next_stop,
            t.distance_remaining_km,
            t.eta_minutes,
            t.updated_at
        FROM tracking t
        JOIN buses b ON t.bus_id = b.id
        LEFT JOIN drivers d ON b.driver_id = d.id
        LEFT JOIN allocations a ON b.id = a.bus_id
        LEFT JOIN routes r ON a.route_id = r.id
        WHERE t.bus_id = ?
        ORDER BY t.id DESC
        LIMIT 1
    `;

    db.query(sql, [busId], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json({ success: false, message: "Tracking data not found for bus" });
        }
        res.json({ success: true, data: enrichTrackingRecord(result[0]) });
    });
};

// POST /api/tracking - Update or insert tracking coordinate
exports.updateTracking = (req, res) => {
    const {
        bus_id,
        latitude,
        longitude,
        speed = 35.0,
        heading = 0.0,
        traffic_level = "Normal",
        next_stop = "Next Stop",
        distance_remaining_km = 4.0,
        eta_minutes = 8
    } = req.body;

    if (!bus_id || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ success: false, message: "bus_id, latitude, and longitude are required." });
    }

    const sql = `
        INSERT INTO tracking
        (bus_id, latitude, longitude, speed, heading, traffic_level, next_stop, distance_remaining_km, eta_minutes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [bus_id, latitude, longitude, speed, heading, traffic_level, next_stop, distance_remaining_km, eta_minutes],
        (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            }

            const updatedData = {
                id: result.insertId,
                bus_id,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                speed: parseFloat(speed),
                heading: parseFloat(heading),
                traffic_level,
                next_stop,
                distance_remaining_km: parseFloat(distance_remaining_km),
                eta_minutes: parseInt(eta_minutes),
                updated_at: new Date().toISOString()
            };

            // Instant Real-Time Push to all SSE clients!
            broadcastSSE("bus_location_update", updatedData);

            res.json({
                success: true,
                message: "Tracking updated successfully",
                data: updatedData
            });
        }
    );
};

// GET /api/tracking/stream - Real-Time Server-Sent Events (SSE) Stream
exports.streamTracking = (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const clientObj = { id: Date.now(), res };
    sseClients.add(clientObj);
    console.log(`🔌 New SSE Client connected. Total active clients: ${sseClients.size}`);

    // Immediately push initial data snapshot
    const initSql = `
        SELECT
            t.id, t.bus_id, b.bus_number, b.capacity, b.current_occupancy, b.status,
            d.name AS driver_name, r.route_name,
            t.latitude, t.longitude, t.speed, t.heading,
            t.traffic_level, t.next_stop, t.distance_remaining_km, t.eta_minutes, t.updated_at
        FROM tracking t
        JOIN buses b ON t.bus_id = b.id
        LEFT JOIN drivers d ON b.driver_id = d.id
        LEFT JOIN allocations a ON b.id = a.bus_id
        LEFT JOIN routes r ON a.route_id = r.id
        INNER JOIN (
            SELECT bus_id, MAX(id) AS max_id FROM tracking GROUP BY bus_id
        ) latest ON t.id = latest.max_id
        ORDER BY b.id ASC
    `;

    db.query(initSql, (err, rows) => {
        if (!err && rows) {
            const initialData = rows.map(enrichTrackingRecord);
            res.write(`event: initial_state\ndata: ${JSON.stringify(initialData)}\n\n`);
        }
    });

    // Heartbeat every 20 seconds to prevent timeout
    const heartbeat = setInterval(() => {
        res.write(": heartbeat\n\n");
    }, 20000);

    req.on("close", () => {
        clearInterval(heartbeat);
        sseClients.delete(clientObj);
        console.log(`❌ SSE Client disconnected. Remaining clients: ${sseClients.size}`);
    });
};

// Simulation Waypoints for realistic real-time bus movement
const ROUTE_SIMULATION_PATHS = {
    1: [
        { lat: 13.0827, lng: 80.2707, stop: "Central Station", heading: 270, dist: 16.5, speed: 38 },
        { lat: 13.0818, lng: 80.2550, stop: "Periamet Junction", heading: 265, dist: 14.8, speed: 32 },
        { lat: 13.0812, lng: 80.2405, stop: "Kilpauk Garden", heading: 275, dist: 13.2, speed: 28 },
        { lat: 13.0830, lng: 80.2250, stop: "Shenoy Nagar Metro", heading: 280, dist: 11.0, speed: 35 },
        { lat: 13.0850, lng: 80.2101, stop: "Anna Nagar East", heading: 285, dist: 8.8, speed: 24 },
        { lat: 13.0835, lng: 80.1925, stop: "Thirumangalam Metro", heading: 290, dist: 6.2, speed: 30 },
        { lat: 13.0900, lng: 80.1770, stop: "Mogappair West", heading: 305, dist: 4.0, speed: 42 },
        { lat: 13.0980, lng: 80.1620, stop: "Ambattur Estate", heading: 320, dist: 2.1, speed: 36 },
        { lat: 13.1145, lng: 80.1410, stop: "Engineering Campus Main Gate", heading: 340, dist: 0.0, speed: 15 }
    ],
    2: [
        { lat: 12.9304, lng: 80.1250, stop: "Tambaram Sanatorium", heading: 30, dist: 20.0, speed: 40 },
        { lat: 12.9516, lng: 80.1412, stop: "Chromepet Station", heading: 35, dist: 16.5, speed: 32 },
        { lat: 12.9675, lng: 80.1500, stop: "Pallavaram Flyover", heading: 40, dist: 13.8, speed: 45 },
        { lat: 12.9810, lng: 80.1780, stop: "Airport Signal", heading: 45, dist: 10.2, speed: 34 },
        { lat: 13.0067, lng: 80.2025, stop: "Guindy Industrial Estate", heading: 50, dist: 7.0, speed: 28 },
        { lat: 13.1145, lng: 80.1410, stop: "Engineering Campus Main Gate", heading: 340, dist: 0.0, speed: 20 }
    ]
};

// In-memory simulation step indices per bus
const simulationIndices = { 1: 3, 2: 3, 3: 1 };

// POST /api/tracking/simulate-step - Advance GPS coordinates along route
exports.simulateStep = (req, res) => {
    const busId = parseInt(req.body.bus_id) || 1;
    const path = ROUTE_SIMULATION_PATHS[busId] || ROUTE_SIMULATION_PATHS[1];

    let currentIndex = simulationIndices[busId] || 0;
    currentIndex = (currentIndex + 1) % path.length;
    simulationIndices[busId] = currentIndex;

    const waypoint = path[currentIndex];
    const etaMins = Math.max(1, Math.round((waypoint.dist / Math.max(20, waypoint.speed)) * 60 + 2));

    const sql = `
        INSERT INTO tracking
        (bus_id, latitude, longitude, speed, heading, traffic_level, next_stop, distance_remaining_km, eta_minutes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [busId, waypoint.lat, waypoint.lng, waypoint.speed, waypoint.heading, waypoint.speed < 26 ? "Heavy" : "Normal", waypoint.stop, waypoint.dist, etaMins],
        (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            }

            const stepData = {
                id: result.insertId,
                bus_id: busId,
                latitude: waypoint.lat,
                longitude: waypoint.lng,
                speed: waypoint.speed,
                heading: waypoint.heading,
                traffic_level: waypoint.speed < 26 ? "Heavy" : "Normal",
                next_stop: waypoint.stop,
                distance_remaining_km: waypoint.dist,
                eta_minutes: etaMins,
                step_index: currentIndex,
                total_steps: path.length,
                updated_at: new Date().toISOString()
            };

            // Broadcast to all listening clients
            broadcastSSE("bus_location_update", stepData);

            res.json({
                success: true,
                message: `Bus #${busId} advanced to step ${currentIndex + 1}/${path.length} (${waypoint.stop})`,
                data: stepData
            });
        }
    );
};

// POST /api/tracking/sos - Broadcast Emergency SOS Alert
exports.sendSOS = (req, res) => {
    const { bus_id = 1, sender_name = "Student/Driver", message = "Emergency SOS Alert Triggered!", latitude, longitude } = req.body;

    const sosSql = `
        INSERT INTO sos_alerts (bus_id, sender_type, sender_name, latitude, longitude, message, status)
        VALUES (?, 'user', ?, ?, ?, ?, 'Active')
    `;

    db.query(sosSql, [bus_id, sender_name, latitude || 13.0842, longitude || 80.2050, message], (err, sosResult) => {
        if (err) {
            console.error("SOS Insert Error:", err.message);
        }

        // Add to notifications table too
        const notifSql = `
            INSERT INTO notifications (bus_id, type, title, message)
            VALUES (?, 'emergency', '🚨 EMERGENCY SOS ALERT', ?)
        `;
        db.query(notifSql, [bus_id, `URGENT: ${sender_name} triggered SOS on Bus #${bus_id}: ${message}`]);

        const sosPayload = {
            id: sosResult ? sosResult.insertId : Date.now(),
            bus_id,
            sender_name,
            message,
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
            is_emergency: true
        };

        // Broadcast urgent event over SSE
        broadcastSSE("emergency_sos", sosPayload);

        res.json({
            success: true,
            message: "🚨 SOS Alert successfully broadcasted to all monitors & response center!",
            data: sosPayload
        });
    });
};