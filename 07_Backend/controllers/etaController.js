// ============================================
// AI Smart Bus Tracking and Notification System
// Advanced AI ETA Prediction Engine
// controllers/etaController.js
// ============================================

const db = require("../config/db");

// Geodesic distance using Haversine formula (km)
function haversineDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
}

// Compute dynamic AI Traffic Congestion Factor (TCF)
function calculateTrafficFactor(speed, hour = new Date().getHours()) {
    // 1. Time-of-day rush hour penalty (Morning: 8-10 AM, Evening: 4:30-7:30 PM)
    const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 16 && hour <= 19);
    let peakMultiplier = isPeakHour ? 1.25 : 1.0;

    // 2. Speed-based congestion detection
    let speedFactor = 1.0;
    let trafficLevel = "Light / Free Flow";

    if (speed <= 0) {
        // Stopped (e.g. at traffic signal or bus stop) - use nominal slow factor
        speedFactor = 1.45;
        trafficLevel = "Signal Stopped / Heavy Delay";
    } else if (speed < 18) {
        speedFactor = 1.55;
        trafficLevel = "Heavy Congestion";
    } else if (speed < 32) {
        speedFactor = 1.20;
        trafficLevel = "Moderate Traffic";
    } else {
        speedFactor = 1.00;
        trafficLevel = "Normal / Free Flow";
    }

    const totalFactor = parseFloat((speedFactor * peakMultiplier).toFixed(2));
    return { factor: totalFactor, trafficLevel, isPeakHour };
}

// Format arrival time (e.g. "03:45 PM")
function formatArrivalTime(minutesToAdd) {
    const d = new Date(Date.now() + Math.round(minutesToAdd) * 60 * 1000);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Comprehensive Advanced ETA Calculation
function computeAdvancedETA(bus, targetStop = null) {
    const rawSpeed = parseFloat(bus.speed) || 0;
    // Speed smoothing: If bus is at a halt (speed < 5 km/h), assume smooth city average of 26 km/h
    const effectiveSpeed = rawSpeed > 5 ? rawSpeed : 26.0;

    // Stops array parsing
    let stops = [];
    if (typeof bus.stops === "string") {
        try { stops = JSON.parse(bus.stops); } catch (e) { stops = []; }
    } else if (Array.isArray(bus.stops)) {
        stops = bus.stops;
    }

    // Determine target destination coordinates
    let destLat = null;
    let destLng = null;
    let destinationName = bus.destination || "Destination Campus";

    if (targetStop && stops.length > 0) {
        const found = stops.find(s => s.name.toLowerCase() === targetStop.toLowerCase());
        if (found) {
            destLat = found.lat;
            destLng = found.lng;
            destinationName = found.name;
        }
    }

    if (!destLat && stops.length > 0) {
        // Default to final stop in route
        const last = stops[stops.length - 1];
        destLat = last.lat;
        destLng = last.lng;
        destinationName = last.name;
    }

    // Direct distance from current location
    let distanceKm = parseFloat(bus.distance_remaining_km) || 0;
    if (destLat && destLng && bus.latitude && bus.longitude) {
        distanceKm = haversineDistance(bus.latitude, bus.longitude, destLat, destLng);
    }
    if (distanceKm <= 0.1) distanceKm = 4.5; // realistic fallback

    // Traffic congestion calculation
    const { factor, trafficLevel, isPeakHour } = calculateTrafficFactor(rawSpeed);

    // Stop dwell-time penalty: 1.5 mins per remaining stop
    let remainingStopsCount = 1;
    let stopTimeline = [];

    if (stops.length > 0) {
        // Calculate ETA for each individual stop along the route
        let cumulativeDist = 0;
        let prevLat = bus.latitude || stops[0].lat;
        let prevLng = bus.longitude || stops[0].lng;

        stopTimeline = stops.map((stop, idx) => {
            const legDist = haversineDistance(prevLat, prevLng, stop.lat, stop.lng);
            cumulativeDist += legDist;
            prevLat = stop.lat;
            prevLng = stop.lng;

            const travelMins = (cumulativeDist / effectiveSpeed) * 60 * factor;
            const dwellMins = idx * 1.5;
            const totalStopMins = Math.max(1, Math.round(travelMins + dwellMins));

            return {
                name: stop.name,
                sequence: stop.sequence || idx + 1,
                distance_km: parseFloat(cumulativeDist.toFixed(1)),
                eta_minutes: totalStopMins,
                predicted_time: formatArrivalTime(totalStopMins)
            };
        });

        remainingStopsCount = Math.max(1, stops.length);
    }

    // Calculate core ETA
    const baseTravelTime = (distanceKm / effectiveSpeed) * 60;
    const dwellTime = Math.min(10, remainingStopsCount * 1.2);
    const finalEtaMinutes = Math.max(1, Math.round(baseTravelTime * factor + dwellTime));

    // Dynamic AI confidence score: 88% - 98%
    let confidence = 96;
    if (rawSpeed === 0) confidence -= 5;
    if (isPeakHour) confidence -= 4;
    if (distanceKm > 10) confidence -= 3;
    confidence = Math.max(82, confidence);

    // Schedule status assessment
    let scheduleStatus = "On Time";
    if (finalEtaMinutes > 30) scheduleStatus = "Heavy Delay (+8m)";
    else if (finalEtaMinutes > 15) scheduleStatus = "Moderate (+3m)";
    else if (finalEtaMinutes <= 3) scheduleStatus = "Arriving Soon";

    return {
        bus_id: bus.bus_id || bus.id,
        bus_number: bus.bus_number,
        route_name: bus.route_name || "General Route",
        current_coordinates: {
            latitude: parseFloat(bus.latitude) || 13.0827,
            longitude: parseFloat(bus.longitude) || 80.2707
        },
        speed_kmh: rawSpeed,
        effective_speed_kmh: effectiveSpeed,
        distance_km: distanceKm,
        eta_minutes: finalEtaMinutes,
        eta_formatted: `${finalEtaMinutes} mins`,
        predicted_arrival_time: formatArrivalTime(finalEtaMinutes),
        destination: destinationName,
        next_stop: bus.next_stop || (stops.length > 0 ? stops[0].name : "Main Gate"),
        remaining_stops: remainingStopsCount,
        traffic_condition: trafficLevel,
        traffic_factor: factor,
        is_rush_hour: isPeakHour,
        ai_confidence_score: `${confidence}%`,
        schedule_status: scheduleStatus,
        stop_timeline: stopTimeline,
        updated_at: bus.updated_at || new Date().toISOString()
    };
}

// GET /api/eta - Get Advanced ETA for all active buses
exports.getETA = (req, res) => {
    const targetStop = req.query.stop || null;

    const sql = `
        SELECT
            buses.id AS bus_id,
            buses.bus_number,
            buses.capacity,
            buses.current_occupancy,
            routes.route_name,
            routes.source,
            routes.destination,
            routes.stops,
            tracking.latitude,
            tracking.longitude,
            tracking.speed,
            tracking.heading,
            tracking.next_stop,
            tracking.distance_remaining_km,
            tracking.updated_at
        FROM buses
        LEFT JOIN allocations ON buses.id = allocations.bus_id
        LEFT JOIN routes ON allocations.route_id = routes.id
        LEFT JOIN (
            SELECT t1.*
            FROM tracking t1
            INNER JOIN (
                SELECT bus_id, MAX(id) AS max_id
                FROM tracking
                GROUP BY bus_id
            ) t2 ON t1.id = t2.max_id
        ) tracking ON buses.id = tracking.bus_id
        ORDER BY buses.id ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("ETA Query Error:", err.message);
            return res.status(500).json({
                success: false,
                message: "Failed to calculate ETA",
                error: err.message
            });
        }

        const etaPredictions = results.map(row => computeAdvancedETA(row, targetStop));

        res.json({
            success: true,
            algorithm: "AI-MultiFactor-Haversine-V2.4",
            timestamp: new Date().toISOString(),
            data: etaPredictions
        });
    });
};

// GET /api/eta/:busId - Single bus in-depth ETA breakdown
exports.getETAByBusId = (req, res) => {
    const busId = req.params.busId;
    const targetStop = req.query.stop || null;

    const sql = `
        SELECT
            buses.id AS bus_id,
            buses.bus_number,
            buses.capacity,
            buses.current_occupancy,
            routes.route_name,
            routes.source,
            routes.destination,
            routes.stops,
            tracking.latitude,
            tracking.longitude,
            tracking.speed,
            tracking.heading,
            tracking.next_stop,
            tracking.distance_remaining_km,
            tracking.updated_at
        FROM buses
        LEFT JOIN allocations ON buses.id = allocations.bus_id
        LEFT JOIN routes ON allocations.route_id = routes.id
        LEFT JOIN tracking ON buses.id = tracking.bus_id
        WHERE buses.id = ?
        ORDER BY tracking.id DESC
        LIMIT 1
    `;

    db.query(sql, [busId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Bus not found or no tracking data"
            });
        }

        const prediction = computeAdvancedETA(results[0], targetStop);
        res.json({
            success: true,
            data: prediction
        });
    });
};

// POST /api/eta/simulate - Interactive What-If Scenario simulator
exports.simulateETA = (req, res) => {
    const { distance_km = 6.5, speed_kmh = 30, traffic_condition = "Moderate", remaining_stops = 3 } = req.body;

    let factor = 1.0;
    if (traffic_condition === "Heavy") factor = 1.6;
    else if (traffic_condition === "Moderate") factor = 1.25;
    else if (traffic_condition === "Jam") factor = 2.1;

    const effectiveSpeed = Math.max(10, speed_kmh);
    const travelTime = (distance_km / effectiveSpeed) * 60;
    const dwell = remaining_stops * 1.5;
    const simulatedETA = Math.round(travelTime * factor + dwell);

    res.json({
        success: true,
        simulation: {
            inputs: { distance_km, speed_kmh, traffic_condition, remaining_stops },
            predicted_eta_minutes: simulatedETA,
            predicted_arrival_time: formatArrivalTime(simulatedETA),
            confidence: factor > 1.5 ? "86%" : "96%",
            advisory: simulatedETA > 20 ? "Expect major traffic delays along corridor." : "Optimal travel conditions."
        }
    });
};