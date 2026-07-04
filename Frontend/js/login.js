// ==========================================
// AI Smart Bus Tracking System
// login.js
// ==========================================

// Get Elements
const loginForm = document.querySelector("form");
const email = document.querySelector('input[type="email"]');
const password = document.querySelector('input[type="password"]');

const roleButtons = document.querySelectorAll(".role-btn");

let selectedRole = "";

// ================================
// Role Selection
// ================================

roleButtons.forEach(button => {

    button.addEventListener("click", function () {

        roleButtons.forEach(btn => {
            btn.style.background = "#e0f2fe";
            btn.style.color = "#2563eb";
        });

        this.style.background = "#2563eb";
        this.style.color = "#ffffff";

        selectedRole = this.textContent.trim();

    });

});

// ================================
// Login Validation
// ================================

loginForm.addEventListener("submit", function(e){

    e.preventDefault();

    if(email.value.trim()===""){

        alert("Please enter your email.");
        email.focus();
        return;

    }

    if(password.value.trim()===""){

        alert("Please enter your password.");
        password.focus();
        return;

    }

    if(selectedRole===""){

        alert("Please select your role.");
        return;

    }

    alert("Login Successful!");

    // Redirect according to role

    if(selectedRole==="Student"){

        window.location.href="student_dashboard.html";

    }

    else if(selectedRole==="Driver"){

        window.location.href="driver_dashboard.html";

    }

    else if(selectedRole==="Admin"){

        window.location.href="admin_dashboard.html";

    }

});

// ================================
// Enter Key Support
// ================================

document.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        loginForm.requestSubmit();

    }

});

// ================================
// Console Message
// ================================

console.log("Login Page Loaded Successfully");
