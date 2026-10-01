// ========================================================
// AI Smart Bus Tracking and Notification System
// Authentication Controller - V2.5
// ========================================================

const DEMO_CREDENTIALS = {
    admin: { email: "admin@smartbus.com", pass: "admin123" },
    driver: { email: "rajesh.driver@smartbus.com", pass: "driver123" },
    student: { email: "kanika@smartbus.com", pass: "student123" }
};

function fillDemo(role) {
    document.getElementById("role").value = role;
    const cred = DEMO_CREDENTIALS[role];
    if (cred) {
        document.getElementById("email").value = cred.email;
        document.getElementById("password").value = cred.pass;
        Toast.show("Credentials Loaded", `Pre-filled ${role.toUpperCase()} demo credentials.`, "info");
    }
}

function onRoleChange() {
    const role = document.getElementById("role").value;
    fillDemo(role);
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        Toast.show("Validation", "Please provide email and password.", "warning");
        return;
    }

    try {
        const res = await SmartBusAPI.login(email, password, role);

        if (res.success) {
            Toast.show("Login Successful", `Welcome back, ${res.user ? res.user.name : "User"}!`, "success");

            setTimeout(() => {
                if (res.redirect) {
                    window.location.href = res.redirect;
                } else if (res.role === "admin") {
                    window.location.href = "adminDashboard.html";
                } else if (res.role === "driver") {
                    window.location.href = "driver.html";
                } else {
                    window.location.href = "dashboard.html";
                }
            }, 600);
        } else {
            Toast.show("Authentication Failed", res.message || "Invalid credentials.", "danger");
        }
    } catch (err) {
        Toast.show("Connection Error", "Unable to connect to the SmartBus authentication server.", "danger");
    }
});

// Auto pre-fill admin by default on boot
window.addEventListener("DOMContentLoaded", () => {
    fillDemo("admin");
});