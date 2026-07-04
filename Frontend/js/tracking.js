// ==========================================
// AI Smart Bus Tracking System
// tracking.js
// ==========================================

// Bus Locations (Demo Data)
const locations = [
    "College Campus",
    "Anna Nagar",
    "Central Bus Stand",
    "Railway Station",
    "City Center",
    "Main Bus Stop"
];

let currentLocation = 0;
let eta = 12;

// ==========================================
// Update Bus Location
// ==========================================

function updateTracking() {

    // Current Location
    const locationCards = document.querySelectorAll(".card p");

    if (locationCards.length > 1) {
        locationCards[1].textContent = locations[currentLocation];
    }

    // ETA
    if (locationCards.length > 3) {
        locationCards[3].textContent = eta + " Minutes";
    }

    // Bus Details Table
    const tableCells = document.querySelectorAll(".bus-details td");

    if (tableCells.length >= 8) {

        tableCells[5].textContent = locations[currentLocation];

        tableCells[7].innerHTML =
            '<span style="color:green;font-weight:bold;">On Route</span>';
    }

    console.log("Bus Location:", locations[currentLocation]);

    currentLocation++;

    if (currentLocation >= locations.length) {
        currentLocation = 0;
    }

    eta--;

    if (eta < 1) {
        eta = 12;
    }

}

// Update every 5 seconds
setInterval(updateTracking, 5000);

// Initial Update
updateTracking();

// ==========================================
// Notification Button
// ==========================================

const buttons = document.querySelectorAll("button");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        alert(button.innerText + " completed successfully.");

    });

});

// ==========================================
// Notification Cards
// ==========================================

const notifications = document.querySelectorAll(".notification-item");

notifications.forEach(item => {

    item.addEventListener("click", () => {

        item.style.background = "#dbeafe";

    });

});

// ==========================================
// Live Status
// ==========================================

console.log("GPS Connected");
console.log("Tracking Started");
console.log("AI ETA Prediction Active");

// ==========================================
// Current Date & Time
// ==========================================

function showTime() {

    const now = new Date();

    console.log(now.toLocaleString());

}

setInterval(showTime, 10000);

// ==========================================
// Bus Speed Simulation
// ==========================================

let speed = 35;

setInterval(() => {

    speed = Math.floor(Math.random() * 20) + 30;

    const cards = document.querySelectorAll(".card p");

    if (cards.length > 2) {

        cards[2].textContent = speed + " km/h";

    }

}, 4000);
