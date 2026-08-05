// ===============================
// Clear Old Login Data
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (emailInput) {
        emailInput.value = "";
    }

    if (passwordInput) {
        passwordInput.value = "";
    }

});


// ===============================
// Backend URL
// ===============================

const API_URL = "https://ecoquest-1-dq9u.onrender.com";


// ===============================
// Login
// ===============================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("message");
    message.textContent = "";

    try {

        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        // Save JWT token
        localStorage.setItem("token", data.token);

        // Save admin info
        if (data.admin) {
            localStorage.setItem("admin", JSON.stringify(data.admin));
        }

        // Redirect
        window.location.href = "dashboard.html";

    } catch (error) {

        console.error("Login Error:", error);

        message.style.color = "red";
        message.textContent = error.message || "Failed to connect to server.";

    }

});