
// =========================
// Protect Dashboard
// =========================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

let bookingChart;


// =========================
// Load Dashboard Data
// =========================

async function loadDashboard() {

    try {

        // =========================
        // Fetch Dashboard Statistics
        // =========================

        const dashboardResponse = await fetch(
            "https://ecoquest-backend-r4d4.onrender.com/api/dashboard/stats",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );


        // =========================
        // Authentication Check
        // =========================

        if (dashboardResponse.status === 401) {

            localStorage.clear();
            sessionStorage.clear();

            window.location.href = "login.html";

            return;
        }


        if (!dashboardResponse.ok) {

            throw new Error(
                `Dashboard request failed: ${dashboardResponse.status}`
            );

        }


        const dashboardData = await dashboardResponse.json();


        console.log("Dashboard Data:", dashboardData);


        // =========================
        // Statistics
        // =========================

        const total = dashboardData.total || 0;

        const pending = dashboardData.pending || 0;

        const confirmed = dashboardData.confirmed || 0;

        const cancelled = dashboardData.cancelled || 0;


        // =========================
        // Update Dashboard Cards
        // =========================

        document.getElementById("totalBookings").textContent = total;

        document.getElementById("pendingBookings").textContent = pending;

        document.getElementById("confirmedBookings").textContent = confirmed;

        document.getElementById("cancelledBookings").textContent = cancelled;


        // =========================
        // Recent Bookings
        // =========================

        const bookings = dashboardData.recentBookings || [];

        const table = document.getElementById("bookingTable");

        table.innerHTML = "";


        if (bookings.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center">
                        No bookings available.
                    </td>
                </tr>
            `;

        } else {

            bookings.forEach(b => {

                const travelDate = b.travelDate
                    ? new Date(b.travelDate).toLocaleDateString()
                    : "N/A";


                table.innerHTML += `
                    <tr>

                        <td>
                            ${b.fullName || "N/A"}
                        </td>

                        <td>
                            ${b.destination || "N/A"}
                        </td>

                        <td>
                            ${travelDate}
                        </td>

                        <td>

                            <span class="status ${String(
                                b.status || ""
                            ).toLowerCase()}">

                                ${b.status || "N/A"}

                            </span>

                        </td>

                    </tr>
                `;

            });

        }


        // =========================
        // Booking Chart
        // =========================

        if (bookingChart) {

            bookingChart.destroy();

        }


        bookingChart = new Chart(
            document.getElementById("bookingChart"),
            {

                type: "bar",

                data: {

                    labels: [
                        "Pending",
                        "Confirmed",
                        "Cancelled"
                    ],

                    datasets: [
                        {

                            label: "Bookings",

                            data: [
                                pending,
                                confirmed,
                                cancelled
                            ]

                        }
                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: true,

                    aspectRatio: 2.5,

                    plugins: {

                        legend: {
                            display: true
                        }

                    }

                }

            }
        );


    } catch (error) {

        console.error("Dashboard Error:", error);

        alert(
            "Unable to load dashboard data. Please check your server and log in again."
        );

    }

}


// =========================
// Load Dashboard
// =========================

loadDashboard();


// ===============================
// LOGOUT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn = document.getElementById("logoutBtn");


    if (logoutBtn) {

        logoutBtn.addEventListener("click", (e) => {

            e.preventDefault();


            // Remove login session

            localStorage.clear();

            sessionStorage.clear();


            // Return to login page

            window.location.replace("login.html");

        });

    }

});
