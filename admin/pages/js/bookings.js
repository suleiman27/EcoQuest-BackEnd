// =======================================
// ECOQUEST BOOKINGS
// =======================================

const API = "http://localhost:5000/api/bookings";

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

        const response = await fetch(API, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load bookings");
        }

        bookings = await response.json();

        updateCards();

        renderTable(bookings);

    } catch (err) {

        console.error(err);

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

    table.innerHTML = "";

    if (data.length === 0) {

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

            <td>${booking.fullName}</td>

            <td>${booking.destination}</td>

            <td>${new Date(booking.travelDate).toLocaleDateString()}</td>

            <td>${booking.travellers}</td>

            <td>

                <span class="badge ${booking.status.toLowerCase()}">

                    ${booking.status}

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

    const filtered = bookings.filter(b =>

        b.fullName.toLowerCase().includes(value) ||

        b.destination.toLowerCase().includes(value) ||

        b.email.toLowerCase().includes(value)

    );

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

    renderTable(

        bookings.filter(

            booking => booking.status === this.value

        )

    );

});

// =======================================
// Open Booking
// =======================================

function openBooking(id) {

    currentBooking = bookings.find(

        booking => booking.id === id

    );

    if (!currentBooking) return;

    document.getElementById("mName").textContent =
        currentBooking.fullName;

    document.getElementById("mEmail").textContent =
        currentBooking.email;

    document.getElementById("mPhone").textContent =
        currentBooking.phone;

    document.getElementById("mDestination").textContent =
        currentBooking.destination;

    document.getElementById("mTravelDate").textContent =
        new Date(currentBooking.travelDate).toLocaleDateString();

    document.getElementById("mTravellers").textContent =
        currentBooking.travellers;

    document.getElementById("mBudget").textContent =
        currentBooking.budget;

    document.getElementById("mCitizenship").textContent =
        currentBooking.citizenship;

    document.getElementById("mStatus").textContent =
        currentBooking.status;

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

    if (e.target === document.getElementById("bookingModal")) {

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

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    status: "CONFIRMED"

                })

            }

        );

        if (!response.ok)
            throw new Error();

        document.getElementById("bookingModal").style.display =
            "none";

        loadBookings();

    }

    catch {

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

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    status: "CANCELLED"

                })

            }

        );

        if (!response.ok)
            throw new Error();

        document.getElementById("bookingModal").style.display =
            "none";

        loadBookings();

    }

    catch {

        alert("Unable to cancel booking.");

    }

};

// =======================================
// Delete Booking
// =======================================

document.getElementById("deleteBooking").onclick = async () => {

    if (!currentBooking) return;

    if (!confirm("Delete this booking permanently?"))
        return;

    try {

        const response = await fetch(

            `${API}/${currentBooking.id}`,

            {

                method: "DELETE",

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        if (!response.ok)
            throw new Error();

        document.getElementById("bookingModal").style.display =
            "none";

        loadBookings();

    }

    catch {

        alert("Unable to delete booking.");

    }

};

// =======================================
// Export Bookings (CSV)
// =======================================

document.querySelector(".export").addEventListener("click", exportBookings);

function exportBookings() {

    if (bookings.length === 0) {

        alert("No bookings to export.");

        return;

    }

    let csv = "Name,Email,Phone,Destination,Travel Date,Travellers,Budget,Status\n";

    bookings.forEach(b => {

        csv += `"${b.fullName}","${b.email}","${b.phone}","${b.destination}","${new Date(b.travelDate).toLocaleDateString()}","${b.travellers}","${b.budget}","${b.status}"\n`;

    });

    const blob = new Blob([csv], {

        type: "text/csv;charset=utf-8;"

    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "EcoQuest_Bookings.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}
// =======================================
// Logout
// =======================================

const logoutBtn = document.getElementById("logout");

if (logoutBtn) {

    logoutBtn.onclick = () => {

        localStorage.removeItem("token");

        window.location.href = "login.html";

    };

}

// =======================================
// Start
// =======================================

loadBookings();