// ============================================
// Comprehensive Automated Test Suite
// Verifies all API endpoints and database integrity
// ============================================

const http = require("http");

const BASE = "http://localhost:5002";

function request(path, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE);
        const reqOpts = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: options.method || "GET",
            headers: options.headers || { "Content-Type": "application/json" }
        };

        const req = http.request(reqOpts, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: data });
                }
            });
        });

        req.on("error", reject);

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        req.end();
    });
}

async function runTests() {
    console.log("🧪 Starting Automated API Test Suite...\n");
    let passed = 0;
    let failed = 0;

    async function test(name, fn) {
        try {
            await fn();
            console.log(`  ✅ PASS: ${name}`);
            passed++;
        } catch (err) {
            console.error(`  ❌ FAIL: ${name} ->`, err.message);
            failed++;
        }
    }

    // 1. Health
    await test("GET /api/health", async () => {
        const res = await request("/api/health");
        if (res.status !== 200 || !res.body.success) throw new Error("Health check failed");
    });

    // 2. Dashboard
    await test("GET /api/dashboard", async () => {
        const res = await request("/api/dashboard");
        if (res.status !== 200 || !res.body.data.totalBuses) throw new Error("Dashboard failed");
    });

    // 3. Tracking
    await test("GET /api/tracking", async () => {
        const res = await request("/api/tracking");
        if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error("Tracking failed");
    });

    // 4. Advanced ETA
    await test("GET /api/eta", async () => {
        const res = await request("/api/eta");
        if (res.status !== 200 || !res.body.algorithm) throw new Error("ETA calculation failed");
    });

    // 5. ETA Simulator
    await test("POST /api/eta/simulate", async () => {
        const res = await request("/api/eta/simulate", {
            method: "POST",
            body: { distance_km: 8.5, speed_kmh: 30, traffic_condition: "Moderate", remaining_stops: 3 }
        });
        if (res.status !== 200 || !res.body.simulation.predicted_eta_minutes) throw new Error("ETA simulation failed");
    });

    // 6. GPS Simulation Step
    await test("POST /api/tracking/simulate-step", async () => {
        const res = await request("/api/tracking/simulate-step", {
            method: "POST",
            body: { bus_id: 1 }
        });
        if (res.status !== 200 || !res.body.success) throw new Error("GPS step simulation failed");
    });

    // 7. Multi-Role Auth - Admin
    await test("POST /api/auth/login (Admin)", async () => {
        const res = await request("/api/auth/login", {
            method: "POST",
            body: { email: "admin@smartbus.com", password: "admin123", role: "admin" }
        });
        if (res.status !== 200 || !res.body.token) throw new Error("Admin login failed");
    });

    // 8. Multi-Role Auth - Driver
    await test("POST /api/auth/login (Driver)", async () => {
        const res = await request("/api/auth/login", {
            method: "POST",
            body: { email: "rajesh.driver@smartbus.com", password: "driver123", role: "driver" }
        });
        if (res.status !== 200 || !res.body.token) throw new Error("Driver login failed");
    });

    // 9. Multi-Role Auth - Student
    await test("POST /api/auth/login (Student)", async () => {
        const res = await request("/api/auth/login", {
            method: "POST",
            body: { email: "kanika@smartbus.com", password: "student123", role: "student" }
        });
        if (res.status !== 200 || !res.body.token) throw new Error("Student login failed");
    });

    // 10. Notifications
    await test("GET /api/notifications", async () => {
        const res = await request("/api/notifications");
        if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error("Notifications failed");
    });

    // 11. Buses
    await test("GET /api/buses", async () => {
        const res = await request("/api/buses");
        if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error("Buses failed");
    });

    // 12. Drivers
    await test("GET /api/drivers", async () => {
        const res = await request("/api/drivers");
        if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error("Drivers failed");
    });

    // 13. Routes
    await test("GET /api/routes", async () => {
        const res = await request("/api/routes");
        if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error("Routes failed");
    });

    // 14. Students
    await test("GET /api/students", async () => {
        const res = await request("/api/students");
        if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error("Students failed");
    });

    // 15. Allocations
    await test("GET /api/allocations", async () => {
        const res = await request("/api/allocations");
        if (res.status !== 200 || !Array.isArray(res.body.data)) throw new Error("Allocations failed");
    });

    // 16. Emergency SOS
    await test("POST /api/tracking/sos", async () => {
        const res = await request("/api/tracking/sos", {
            method: "POST",
            body: { bus_id: 1, sender_name: "Test Runner", message: "Automated test SOS" }
        });
        if (res.status !== 200 || !res.body.data.is_emergency) throw new Error("SOS broadcast failed");
    });

    // 17. Frontend Static Serving
    await test("GET / (Static Frontend)", async () => {
        const res = await request("/");
        if (res.status !== 200 || !res.raw.includes("SmartBus")) throw new Error("Frontend static serve failed");
    });

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) process.exit(1);
    else process.exit(0);
}

// Start server in background for testing if not already running
const serverProcess = require("./server.js");

setTimeout(runTests, 1500);
