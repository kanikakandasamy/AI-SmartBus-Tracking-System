// ==========================================
// AI Smart Bus Tracking System
// dashboard.js
// ==========================================

// Welcome Message
window.addEventListener("load", () => {
    console.log("Dashboard Loaded Successfully");
});

// ==========================================
// Logout Confirmation
// ==========================================

const logoutLink = document.querySelector('a[href="login.html"]');

if (logoutLink) {

    logoutLink.addEventListener("click", function (e) {

        const confirmLogout = confirm("Are you sure you want to logout?");

        if (!confirmLogout) {
            e.preventDefault();
        }

    });

}

// ==========================================
// Dashboard Buttons
// ==========================================

const buttons = document.querySelectorAll("button");

buttons.forEach(button => {

    button.addEventListener("click", function () {

        alert(this.innerText + " action executed successfully.");

    });

});

// ==========================================
// Notification Icon
// ==========================================

const bell = document.querySelector(".profile i");

if (bell) {

    bell.addEventListener("click", () => {

        alert("You have new notifications.");

    });

}

// ==========================================
// Card Hover Animation
// ==========================================

const cards = document.querySelectorAll(".card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-8px)";
        card.style.transition = "0.3s";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "translateY(0px)";

    });

});

// ==========================================
// Live Date & Time
// ==========================================

function updateTime() {

    const now = new Date();

    const timeString = now.toLocaleString();

    console.log("Current Time:", timeString);

}

setInterval(updateTime, 1000);

// ==========================================
// Dashboard Loaded Message
// ==========================================

setTimeout(() => {

    console.log("SmartBus Dashboard Ready");

}, 1000);
