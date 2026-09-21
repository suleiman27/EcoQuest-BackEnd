// ==========================================
// ECOQUEST ADMIN - REVIEWS JAVASCRIPT
// ==========================================


// ===============================
// CONFIGURATION
// ===============================

const API_BASE =
    "https://ecoquest-backend-r4d4.onrender.com/api/reviews";

const API_URL =
    `${API_BASE}/admin/all`;


let reviews = [];


// ===============================
// AUTH CHECK
// ===============================

function checkAuth() {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "login.html";

    }

}

checkAuth();


// ===============================
// AUTH HEADERS
// ===============================

function authHeaders() {

    return {

        "Content-Type": "application/json",

        "Authorization":
            `Bearer ${localStorage.getItem("token")}`

    };

}


// ===============================
// LOAD REVIEWS
// ===============================

async function loadReviews() {

    try {

        console.log("Loading reviews from:", API_URL);

        const response = await fetch(API_URL, {

            method: "GET",

            headers: authHeaders()

        });


        console.log("Reviews HTTP status:", response.status);


        if (response.status === 401) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                `Unable to fetch reviews. Status: ${response.status}`
            );

        }


        reviews = await response.json();


        console.log("Reviews loaded:", reviews);


        displayReviews(reviews);

        updateStatistics(reviews);


    }

    catch (error) {

        console.error("Reviews error:", error);

        showEmptyState();

    }

}


// ===============================
// DISPLAY REVIEWS
// ===============================

function displayReviews(data) {

    const table =
        document.getElementById("reviewTable");


    if (!table) return;


    table.innerHTML = "";


    if (data.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="7">

                    No reviews found.

                </td>

            </tr>

        `;

        return;

    }


    data.forEach((review, index) => {

        let stars = "";


        for (let i = 0; i < review.rating; i++) {

            stars += "⭐";

        }


        table.innerHTML += `

            <tr>

                <td>

                    ${index + 1}

                </td>


                <td>

                    ${review.name || "N/A"}

                </td>


                <td class="rating">

                    ${stars}

                </td>


                <td>

                    ${review.comment || ""}

                </td>


                <td>

                    ${formatDate(review.createdAt)}

                </td>


                <td>

                    <span class="status
                    ${review.approved ? "approved" : "pending"}">

                        ${review.approved
                            ? "Approved"
                            : "Pending"}

                    </span>

                </td>


                <td>

                    <button

                        class="action-btn view"

                        onclick="viewReview(${review.id})">

                        View

                    </button>


                    ${
                        !review.approved
                            ? `

                            <button

                                class="action-btn approve"

                                onclick="approveReview(${review.id})">

                                Approve

                            </button>

                            `
                            : ""
                    }


                    <button

                        class="action-btn delete"

                        onclick="deleteReview(${review.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });

}


// ===============================
// STATISTICS
// ===============================

function updateStatistics(data) {

    const total =
        document.getElementById("totalReviews");


    const average =
        document.getElementById("averageRating");


    const pending =
        document.getElementById("pendingReviews");


    const approved =
        document.getElementById("approvedReviews");


    if (total) {

        total.textContent = data.length;

    }


    const avg = data.length

        ? data.reduce(

            (sum, review) =>
                sum + Number(review.rating || 0),

            0

        ) / data.length

        : 0;


    if (average) {

        average.textContent =
            avg.toFixed(1);

    }


    if (pending) {

        pending.textContent =
            data.filter(
                review => !review.approved
            ).length;

    }


    if (approved) {

        approved.textContent =
            data.filter(
                review => review.approved
            ).length;

    }

}


// ===============================
// SEARCH
// ===============================

const searchBox =
    document.getElementById("searchReview");


if (searchBox) {

    searchBox.addEventListener(
        "input",
        function () {

            const value =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                reviews.filter(review => {

                    const name =
                        (review.name || "")
                            .toLowerCase();


                    const comment =
                        (review.comment || "")
                            .toLowerCase();


                    return (
                        name.includes(value) ||
                        comment.includes(value)
                    );

                });


            displayReviews(filtered);

        }
    );

}


// ===============================
// VIEW REVIEW
// ===============================

window.viewReview = function (id) {

    const review =
        reviews.find(
            r => r.id === id
        );


    if (!review) return;


    const details =
        document.getElementById("reviewDetails");


    if (details) {

        details.innerHTML = `

            <p>

                <strong>Name:</strong>

                ${review.name || "N/A"}

            </p>


            <p>

                <strong>Rating:</strong>

                ${review.rating || 0} ⭐

            </p>


            <p>

                <strong>Review:</strong>

            </p>


            <p>

                ${review.comment || "No comment"}

            </p>


            <p>

                <strong>Status:</strong>

                ${review.approved
                    ? "Approved"
                    : "Pending"}

            </p>


            <p>

                <strong>Date:</strong>

                ${formatDate(review.createdAt)}

            </p>

        `;

    }


    const modal =
        document.getElementById("reviewModal");


    if (modal) {

        modal.style.display = "flex";

    }

};


// ===============================
// APPROVE REVIEW
// ===============================

window.approveReview = async function (id) {

    try {

        console.log(
            "Approving review:",
            id
        );


        const response =
            await fetch(

                `${API_BASE}/approve/${id}`,

                {

                    method: "PUT",

                    headers: authHeaders()

                }

            );


        console.log(
            "Approve response:",
            response.status
        );


        if (response.status === 401) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                `Failed to approve review. Status: ${response.status}`
            );

        }


        alert("Review approved successfully.");


        await loadReviews();

    }


    catch (error) {

        console.error(
            "Approve review error:",
            error
        );


        alert(
            "Failed to approve review."
        );

    }

};


// ===============================
// DELETE REVIEW
// ===============================

window.deleteReview = async function (id) {

    const confirmDelete =
        confirm(
            "Delete this review?"
        );


    if (!confirmDelete) return;


    try {

        console.log(
            "Deleting review:",
            id
        );


        const response =
            await fetch(

                `${API_BASE}/${id}`,

                {

                    method: "DELETE",

                    headers: authHeaders()

                }

            );


        console.log(
            "Delete response:",
            response.status
        );


        if (response.status === 401) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                `Failed to delete review. Status: ${response.status}`
            );

        }


        alert(
            "Review deleted successfully."
        );


        await loadReviews();

    }


    catch (error) {

        console.error(
            "Delete review error:",
            error
        );


        alert(
            "Failed to delete review."
        );

    }

};


// ===============================
// CLOSE MODAL
// ===============================

const closeBtn =
    document.querySelector(".close");


if (closeBtn) {

    closeBtn.onclick = function () {

        const modal =
            document.getElementById(
                "reviewModal"
            );


        if (modal) {

            modal.style.display = "none";

        }

    };

}


// ===============================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ===============================

window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "reviewModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            modal.style.display = "none";

        }

    }
);


// ===============================
// REFRESH
// ===============================

const refreshBtn =
    document.getElementById(
        "refreshBtn"
    );


if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        loadReviews
    );

}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("admin");

    window.location.href =
        "login.html";

}


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logout
    );

}


// ===============================
// DATE FORMAT
// ===============================

function formatDate(date) {

    if (!date) {

        return "N/A";

    }


    return new Date(date)
        .toLocaleDateString(

            "en-GB",

            {

                year: "numeric",

                month: "short",

                day: "numeric"

            }

        );

}


// ===============================
// EMPTY STATE
// ===============================

function showEmptyState() {

    const table =
        document.getElementById(
            "reviewTable"
        );


    if (table) {

        table.innerHTML = `

            <tr>

                <td colspan="7">

                    Unable to load reviews.

                </td>

            </tr>

        `;

    }

}


// ===============================
// INITIAL LOAD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadReviews();

    }
);
