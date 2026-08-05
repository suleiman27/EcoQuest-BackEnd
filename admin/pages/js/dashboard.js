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
        // Fetch Bookings
        // =========================

    const bookingResponse = await fetch("https://ecoquest-1-12jk.onrender.com/api/bookings", {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

            headers: {

                Authorization: `Bearer ${token}`

            }

        });


        if (!bookingResponse.ok) {

            throw new Error("Failed to fetch bookings");

        }


        const bookings = await bookingResponse.json();





        // =========================
        // Fetch Messages
        // =========================

        const messageResponse = await fetch("https://ecoquest-1-12jk.onrender.com/api/messages", {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });


        let messages = [];


        if(messageResponse.ok){

            messages = await messageResponse.json();

        }







        // =========================
        // Fetch Reviews
        // =========================

        const reviewResponse = await fetch("https://ecoquest-1-12jk.onrender.com/api/reviews");


        let reviews = [];


        if(reviewResponse.ok){

            reviews = await reviewResponse.json();

        }







        // =========================
        // Statistics
        // =========================


        const pending =
        bookings.filter(b => b.status === "PENDING").length;


        const confirmed =
        bookings.filter(b => b.status === "CONFIRMED").length;


        const cancelled =
        bookings.filter(b => b.status === "CANCELLED").length;




        document.getElementById("totalBookings").textContent = bookings.length;

        document.getElementById("pendingBookings").textContent = pending;

        document.getElementById("confirmedBookings").textContent = confirmed;

        document.getElementById("cancelledBookings").textContent = cancelled;





        const totalMessages = document.getElementById("totalMessages");

        if(totalMessages){

            totalMessages.textContent = messages.length;

        }




        const totalReviews = document.getElementById("totalReviews");

        if(totalReviews){

            totalReviews.textContent = reviews.length;

        }









        // =========================
        // Recent Bookings Table
        // =========================


        const table = document.getElementById("bookingTable");


        table.innerHTML = "";



        if(bookings.length === 0){


            table.innerHTML = `

            <tr>

            <td colspan="4" style="text-align:center">

            No bookings available.

            </td>

            </tr>

            `;


        }else{


            bookings

            .sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt))

            .slice(0,10)

            .forEach(b=>{


                table.innerHTML += `

                <tr>

                <td>${b.fullName}</td>

                <td>${b.destination}</td>

                <td>${new Date(b.travelDate).toLocaleDateString()}</td>

                <td>

                <span class="status ${b.status.toLowerCase()}">

                ${b.status}

                </span>

                </td>


                </tr>

                `;


            });


        }









        // =========================
        // Booking Chart
        // =========================


        if(bookingChart){

            bookingChart.destroy();

        }




        bookingChart = new Chart(

        document.getElementById("bookingChart"),{


            type:"bar",


            data:{


                labels:[

                    "Pending",

                    "Confirmed",

                    "Cancelled"

                ],


                datasets:[{


                    label:"Bookings",


                    data:[

                        pending,

                        confirmed,

                        cancelled

                    ]


                }]


            },


            options:{


                responsive:true,


                maintainAspectRatio:true,


                aspectRatio:2.5,


                plugins:{


                    legend:{


                        display:true


                    }


                }


            }


        });


    }



    catch(error){


        console.error("Dashboard Error:",error);


        alert(
        "Unable to load dashboard data. Please check your server and log in again."
        );


    }


}





// Load Dashboard

loadDashboard();






// ===============================
// LOGOUT
// ===============================


document.addEventListener("DOMContentLoaded",()=>{


    const logoutBtn = document.getElementById("logoutBtn");



    if(logoutBtn){



        logoutBtn.addEventListener("click",(e)=>{


            e.preventDefault();



            // Remove login session

            localStorage.clear();

            sessionStorage.clear();



            // Return to login page

            window.location.replace("login.html");



        });



    }



});