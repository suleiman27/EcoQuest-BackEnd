// ==========================================
// ECOQUEST ADMIN - CUSTOMERS
// ==========================================

// ==========================================
// CONFIGURATION
// ==========================================

const API = "http://localhost:5000/api/customers";

const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "login.html";

}

let customers = [];

let currentCustomer = null;

// ==========================================
// DOM ELEMENTS
// ==========================================

const customerTable = document.getElementById("customerTable");

const searchCustomer = document.getElementById("searchCustomer");

const refreshBtn = document.getElementById("refreshBtn");

const customerModal = document.getElementById("customerModal");

const customerDetails = document.getElementById("customerDetails");

const closeModal = document.querySelector(".close");

// Statistics

const totalCustomers = document.getElementById("totalCustomers");

const activeCustomers = document.getElementById("activeCustomers");

const travellers = document.getElementById("travellers");

const revenue = document.getElementById("revenue");

// ==========================================
// AUTH HEADERS
// ==========================================

function authHeaders() {

    return {

        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`

    };

}

// ==========================================
// LOAD CUSTOMERS
// ==========================================

async function loadCustomers() {

    try {

        const response = await fetch(API, {

            method: "GET",

            headers: authHeaders()

        });

        if (response.status === 401) {

            logout();

            return;

        }

        if (!response.ok) {

            throw new Error("Unable to load customers.");

        }

        customers = await response.json();

        renderCustomers(customers);

        updateStatistics(customers);

    }

    catch (error) {

        console.error(error);

        showEmptyState();

    }

}

// ==========================================
// RENDER CUSTOMERS
// ==========================================

function renderCustomers(data) {

    customerTable.innerHTML = "";

    if (data.length === 0) {

        customerTable.innerHTML = `

        <tr>

            <td colspan="8">

                <div class="empty">

                    <i class="fa-solid fa-users-slash"></i>

                    <h3>No Customers Found</h3>

                    <p>No customers available.</p>

                </div>

            </td>

        </tr>

        `;

        return;

    }

    data.forEach((customer, index) => {

        customerTable.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${customer.fullName}</td>

            <td>${customer.email}</td>

            <td>${customer.phone}</td>

            <td>${customer.trips}</td>

            <td>${formatDate(customer.lastBooking)}</td>

            <td>

                <span class="status active">

                    Active

                </span>

            </td>

            <td>

                <div class="table-actions">

                    <button

                    class="view-btn"

                    onclick="viewCustomer(${customer.id})">

                        <i class="fa-solid fa-eye"></i>

                        View

                    </button>

                    <button

                    class="delete-btn"

                    onclick="deleteCustomer(${customer.id})">

                        <i class="fa-solid fa-trash"></i>

                        Delete

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}

// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics(data) {

    totalCustomers.textContent = data.length;

    activeCustomers.textContent = data.length;

    let totalTrips = 0;

    let totalRevenue = 0;

    data.forEach(customer => {

        totalTrips += customer.trips || 0;

        totalRevenue += customer.amount || 0;

    });

    travellers.textContent = totalTrips;

    revenue.textContent = `KSh ${totalRevenue.toLocaleString()}`;

}

// ==========================================
// SEARCH CUSTOMERS
// ==========================================

searchCustomer.addEventListener("keyup", () => {

    const value = searchCustomer.value
        .trim()
        .toLowerCase();

    if (!value) {

        renderCustomers(customers);

        return;

    }

    const filtered = customers.filter(customer =>

        customer.fullName?.toLowerCase().includes(value)

        ||

        customer.email?.toLowerCase().includes(value)

        ||

        customer.phone?.includes(value)

        ||

        customer.destination?.toLowerCase().includes(value)

    );

    renderCustomers(filtered);

});

// ==========================================
// VIEW CUSTOMER
// ==========================================

window.viewCustomer = function(id) {

    currentCustomer = customers.find(customer => customer.id == id);

    if (!currentCustomer) return;

    customerDetails.innerHTML = `

        <p>

            <strong>Name:</strong>

            ${currentCustomer.fullName}

        </p>

        <p>

            <strong>Email:</strong>

            ${currentCustomer.email}

        </p>

        <p>

            <strong>Phone:</strong>

            ${currentCustomer.phone}

        </p>

        <p>

            <strong>Total Trips:</strong>

            ${currentCustomer.trips}

        </p>

        <p>

            <strong>Favourite Destination:</strong>

            ${currentCustomer.destination || "N/A"}

        </p>

        <p>

            <strong>Last Booking:</strong>

            ${formatDate(currentCustomer.lastBooking)}

        </p>

        <p>

            <strong>Registered:</strong>

            ${formatDate(currentCustomer.createdAt)}

        </p>

    `;

    customerModal.style.display = "flex";

};

// ==========================================
// DELETE CUSTOMER
// ==========================================

window.deleteCustomer = async function(id) {

    if (!confirm("Delete this customer?")) {

        return;

    }

    try {

        const response = await fetch(

            `${API}/${id}`,

            {

                method: "DELETE",

                headers: authHeaders()

            }

        );

        if (!response.ok) {

            throw new Error("Delete failed.");

        }

        alert("Customer deleted successfully.");

        loadCustomers();

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete customer.");

    }

};

// ==========================================
// REFRESH
// ==========================================

refreshBtn.addEventListener("click", () => {

    loadCustomers();

});

// ==========================================
// MODAL
// ==========================================

closeModal.onclick = () => {

    customerModal.style.display = "none";

};

window.onclick = function(e) {

    if (e.target === customerModal) {

        customerModal.style.display = "none";

    }

};

// ==========================================
// DATE FORMATTER
// ==========================================

function formatDate(date) {

    if (!date) {

        return "N/A";

    }

    return new Date(date).toLocaleDateString("en-GB", {

        day: "2-digit",

        month: "short",

        year: "numeric"

    });

}

// ==========================================
// EMPTY STATE
// ==========================================

function showEmptyState() {

    customerTable.innerHTML = `

        <tr>

            <td colspan="8">

                <div class="empty">

                    <i class="fa-solid fa-users-slash"></i>

                    <h3>Unable to load customers</h3>

                    <p>Please check your server connection.</p>

                </div>

            </td>

        </tr>

    `;

}

// ==========================================
// SIMPLE NOTIFICATION
// ==========================================

function notify(message, type = "success") {

    console.log(`[${type}] ${message}`);

    // Replace with toast notification later if desired.

}

// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("admin");

    window.location.href = "login.html";

}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", logout);

}

// ==========================================
// INITIALIZE PAGE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadCustomers();

});