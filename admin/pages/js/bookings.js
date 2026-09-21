// =======================================
// ECOQUEST BOOKINGS
// =======================================

const API = "https://ecoquest-backend-r4d4.onrender.com/api/bookings";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

let bookings = [];
let currentBooking = null;


// =======================================
// Load Bookings
// =======================================

async function loadBookings() {

    try {

        console.log("Loading bookings from:", API);

        const response = await fetch(API, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Bookings HTTP Status:", response.status);

        if (!response.ok) {
            throw new Error(`Failed to load bookings: ${response.status}`);
        }

        bookings = await response.json();

        console.log("Bookings loaded:", bookings);

        updateCards();

        renderTable(bookings);

    } catch (err) {

        console.error("Bookings Error:", err);

        const table = document.getElementById("bookingTable");

        if (table) {
            table.innerHTML = `
                <tr>
                    <td colspan="6">
                        Unable to load bookings.
                    </td>
                </tr>
            `;
        }

    }

}


// =======================================
// Statistics
// =======================================

function updateCards() {

    document.getElementById("totalBookings").textContent =
        bookings.length;

    document.getElementById("pendingBookings").textContent =
        bookings.filter(b => b.status === "PENDING").length;

    document.getElementById("confirmedBookings").textContent =
        bookings.filter(b => b.status === "CONFIRMED").length;

    document.getElementById("cancelledBookings").textContent =
        bookings.filter(b => b.status === "CANCELLED").length;

}


// =======================================
// Render Table
// =======================================

function renderTable(data) {

    const table = document.getElementById("bookingTable");

    if (!table) {
        console.error("bookingTable element not found.");
        return;
    }

    table.innerHTML = "";

    if (!data || data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No bookings found
                </td>
            </tr>
        `;

        return;
    }

    data.forEach(booking => {

        table.innerHTML += `
            <tr>

                <td>
                    ${booking.fullName || "N/A"}
                </td>

                <td>
                    ${booking.destination || "N/A"}
                </td>

                <td>
                    ${
                        booking.travelDate
                            ? new Date(booking.travelDate).toLocaleDateString()
                            : "N/A"
                    }
                </td>

                <td>
                    ${booking.travellers || 0}
                </td>

                <td>

                    <span class="badge ${String(booking.status || "").toLowerCase()}">

                        ${booking.status || "UNKNOWN"}

                    </span>

                </td>

                <td>

                    <button
                        class="view"
                        onclick="openBooking(${booking.id})">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                </td>

            </tr>
        `;

    });

}


// =======================================
// Search
// =======================================

document.getElementById("searchBooking").addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const filtered = bookings.filter(b => {

        const name = String(b.fullName || "").toLowerCase();
        const destination = String(b.destination || "").toLowerCase();
        const email = String(b.email || "").toLowerCase();

        return (
            name.includes(value) ||
            destination.includes(value) ||
            email.includes(value)
        );

    });

    renderTable(filtered);

});


// =======================================
// Filter
// =======================================

document.getElementById("statusFilter").addEventListener("change", function () {

    if (this.value === "ALL") {

        renderTable(bookings);

        return;
    }

    const filtered = bookings.filter(
        booking => booking.status === this.value
    );

    renderTable(filtered);

});


// =======================================
// Open Booking
// =======================================

function openBooking(id) {

    currentBooking = bookings.find(
        booking => booking.id === id
    );

    if (!currentBooking) {
        console.error("Booking not found:", id);
        return;
    }

    document.getElementById("mName").textContent =
        currentBooking.fullName || "N/A";

    document.getElementById("mEmail").textContent =
        currentBooking.email || "N/A";

    document.getElementById("mPhone").textContent =
        currentBooking.phone || "N/A";

    document.getElementById("mDestination").textContent =
        currentBooking.destination || "N/A";

    document.getElementById("mTravelDate").textContent =
        currentBooking.travelDate
            ? new Date(currentBooking.travelDate).toLocaleDateString()
            : "N/A";

    document.getElementById("mTravellers").textContent =
        currentBooking.travellers || 0;

    document.getElementById("mBudget").textContent =
        currentBooking.budget || "N/A";

    document.getElementById("mCitizenship").textContent =
        currentBooking.citizenship || "N/A";

    document.getElementById("mStatus").textContent =
        currentBooking.status || "N/A";

    document.getElementById("mNotes").textContent =
        currentBooking.notes || "No notes";

    document.getElementById("bookingModal").style.display =
        "flex";

}


// =======================================
// Close Modal
// =======================================

document.getElementById("closeModal").onclick = () => {

    document.getElementById("bookingModal").style.display =
        "none";

};


window.onclick = function (e) {

    if (
        e.target ===
        document.getElementById("bookingModal")
    ) {

        document.getElementById("bookingModal").style.display =
            "none";

    }

};


// =======================================
// Confirm Booking
// =======================================

document.getElementById("confirmBooking").onclick = async () => {

    if (!currentBooking) return;

    try {

        const response = await fetch(
            `${API}/${currentBooking.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    status: "CONFIRMED"
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        document.getElementById("bookingModal").style.display =
            "none";

        await loadBookings();

    } catch (error) {

        console.error(error);

        alert("Unable to confirm booking.");

    }

};


// =======================================
// Cancel Booking
// =======================================

document.getElementById("cancelBooking").onclick = async () => {

    if (!currentBooking) return;

    try {

        const response = await fetch(
            `${API}/${currentBooking.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    status: "CANCELLED"
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        document.getElementById("bookingModal").style.display =
            "none";

        await loadBookings();

    } catch (error) {

        console.error(error);

        alert("Unable to cancel booking.");

    }

};


// =======================================
// Delete Booking
// =======================================

document.getElementById("deleteBooking").onclick = async () => {

    if (!currentBooking) return;

    if (!confirm("Delete this booking permanently?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API}/${currentBooking.id}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        document.getElementById("bookingModal").style.display =
            "none";

        await loadBookings();

    } catch (error) {

        console.error(error);

        alert("Unable to delete booking.");

    }

};


// =======================================
// Export Bookings (CSV)
// =======================================

document
    .querySelector(".export")
    .addEventListener("click", exportBookings);


function exportBookings() {

    if (bookings.length === 0) {

        alert("No bookings to export.");

        return;
    }

    let csv =
        "Name,Email,Phone,Destination,Travel Date,Travellers,Budget,Status\n";

    bookings.forEach(b => {

        csv +=
            `"${b.fullName || ""}",` +
            `"${b.email || ""}",` +
            `"${b.phone || ""}",` +
            `"${b.destination || ""}",` +
            `"${b.travelDate ? new Date(b.travelDate).toLocaleDateString() : ""}",` +
            `"${b.travellers || ""}",` +
            `"${b.budget || ""}",` +
            `"${b.status || ""}"\n`;

    });

    const blob = new Blob(
        [csv],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "EcoQuest_Bookings.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


// =======================================
// Logout
// =======================================

const logoutBtn = document.getElementById("logout");

if (logoutBtn) {

    logoutBtn.onclick = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("admin");

        localStorage.removeItem("adminName");

        window.location.href = "login.html";

    };

}


// =======================================
// Start
// =======================================

loadBookings();
