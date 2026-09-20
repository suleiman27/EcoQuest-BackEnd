
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
// Login
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("message");

        message.textContent = "";
        message.style.color = "";


        try {

            // Current backend
            const response = await fetch("/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })

            });


            const data = await response.json();


            // ===============================
            // Login Failed
            // ===============================

            if (!response.ok) {

                throw new Error(
                    data.message || "Login failed"
                );

            }


            // ===============================
            // Save JWT
            // ===============================

            localStorage.setItem(
                "token",
                data.token
            );


            // ===============================
            // Save Admin Information
            // ===============================

            if (data.admin) {

                localStorage.setItem(
                    "admin",
                    JSON.stringify(data.admin)
                );

                if (data.admin.username) {

                    localStorage.setItem(
                        "adminName",
                        data.admin.username
                    );

                }

            }


            // ===============================
            // Go To Dashboard
            // ===============================

            window.location.href = "dashboard.html";


        } catch (error) {

            console.error("Login Error:", error);

            message.style.color = "red";

            message.textContent =
                error.message ||
                "Failed to connect to server.";

        }

    });

}

