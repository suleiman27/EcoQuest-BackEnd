// ==========================================
// ECOQUEST ADMIN - REVIEWS JAVASCRIPT
// ==========================================


// ===============================
// CONFIGURATION
// ===============================

const API_URL =
"http://localhost:5000/api/reviews/admin/all";


let reviews = [];




// ===============================
// AUTH CHECK
// ===============================

function checkAuth(){

    const token = localStorage.getItem("token");

    if(!token){

        window.location.href="login.html";

    }

}

checkAuth();





// ===============================
// AUTH HEADERS
// ===============================

function authHeaders(){

    return {

        "Content-Type":"application/json",

        "Authorization":
        `Bearer ${localStorage.getItem("token")}`

    };

}






// ===============================
// LOAD REVIEWS
// ===============================

async function loadReviews(){


    try{


        const response = await fetch(API_URL,{

            method:"GET",

            headers:authHeaders()

        });



        if(response.status === 401){

            logout();

            return;

        }



        if(!response.ok){

            throw new Error(
                "Unable to fetch reviews"
            );

        }



        reviews = await response.json();



        displayReviews(reviews);


        updateStatistics(reviews);



    }


    catch(error){


        console.error(error);


        showEmptyState();


    }


}









// ===============================
// DISPLAY REVIEWS
// ===============================

function displayReviews(data){


    const table =
    document.getElementById("reviewTable");



    if(!table) return;



    table.innerHTML="";



    if(data.length===0){


        table.innerHTML=`

        <tr>

            <td colspan="7">

                No reviews found.

            </td>

        </tr>

        `;

        return;

    }





    data.forEach((review,index)=>{


        let stars="";


        for(let i=0;i<review.rating;i++){

            stars+="⭐";

        }





        table.innerHTML += `


        <tr>


            <td>

                ${index+1}

            </td>



            <td>

                ${review.name}

            </td>



            <td class="rating">

                ${stars}

            </td>



            <td>

                ${review.comment}

            </td>



            <td>

                ${formatDate(review.createdAt)}

            </td>




            <td>


                <span class="status 
                ${review.approved ? "approved":"pending"}">


                ${review.approved ? 
                "Approved":"Pending"}


                </span>


            </td>




            <td>


                <button

                class="action-btn view"

                onclick="viewReview(${review.id})">

                View

                </button>





                ${!review.approved ? `


                <button

                class="action-btn approve"

                onclick="approveReview(${review.id})">

                Approve

                </button>


                `:""}





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

function updateStatistics(data){



    const total =
    document.getElementById("totalReviews");


    const average =
    document.getElementById("averageRating");


    const pending =
    document.getElementById("pendingReviews");


    const approved =
    document.getElementById("approvedReviews");




    if(total)

    total.textContent=data.length;




    const avg = data.length ?

    data.reduce(

        (sum,review)=>
        sum + review.rating,

        0

    ) / data.length

    :0;



    if(average)

    average.textContent =
    avg.toFixed(1);




    if(pending)

    pending.textContent =
    data.filter(
        review=>!review.approved
    ).length;




    if(approved)

    approved.textContent =
    data.filter(
        review=>review.approved
    ).length;



}









// ===============================
// SEARCH
// ===============================

const searchBox =
document.getElementById("searchReview");


if(searchBox){


searchBox.addEventListener(
"input",
function(){


    const value =
    this.value.toLowerCase();



    const filtered =
    reviews.filter(review=>


        review.name
        .toLowerCase()
        .includes(value)



        ||

        review.comment
        .toLowerCase()
        .includes(value)


    );



    displayReviews(filtered);



});


}









// ===============================
// VIEW REVIEW
// ===============================

function viewReview(id){


    const review =
    reviews.find(
        r=>r.id===id
    );



    if(!review) return;



    const details =
    document.getElementById("reviewDetails");



    if(details){


        details.innerHTML=`


        <p>

        <strong>Name:</strong>
        ${review.name}

        </p>



        <p>

        <strong>Rating:</strong>
        ${review.rating} ⭐

        </p>



        <p>

        <strong>Review:</strong>

        </p>



        <p>

        ${review.comment}

        </p>



        <p>

        <strong>Status:</strong>

        ${review.approved ?
        "Approved":"Pending"}

        </p>



        <p>

        <strong>Date:</strong>

        ${formatDate(review.createdAt)}

        </p>


        `;


    }



    document.getElementById("reviewModal")
    .style.display="flex";


}









// ===============================
// APPROVE REVIEW
// ===============================

async function approveReview(id){


    try{


        const response =
        await fetch(

        `http://localhost:5000/api/reviews/approve/${id}`,

        {

            method:"PUT",

            headers:authHeaders()

        });


        if(!response.ok){

            throw new Error();

        }



        loadReviews();


    }


    catch(error){


        console.error(error);


        alert(
            "Failed to approve review"
        );


    }


}









// ===============================
// DELETE REVIEW
// ===============================

async function deleteReview(id){


    if(!confirm(
        "Delete this review?"
    ))

    return;




    try{


        const response =
        await fetch(

        `http://localhost:5000/api/reviews/${id}`,

        {

            method:"DELETE",

            headers:authHeaders()

        });



        if(!response.ok){

            throw new Error();

        }



        loadReviews();



    }


    catch(error){


        console.error(error);


        alert(
            "Failed to delete review"
        );


    }


}









// ===============================
// CLOSE MODAL
// ===============================

const closeBtn =
document.querySelector(".close");


if(closeBtn){


closeBtn.onclick=function(){


document.getElementById("reviewModal")
.style.display="none";


};


}








window.onclick=function(event){


const modal =
document.getElementById("reviewModal");


if(event.target===modal){

    modal.style.display="none";

}


};









// ===============================
// REFRESH
// ===============================

const refreshBtn =
document.getElementById("refreshBtn");


if(refreshBtn){

refreshBtn.addEventListener(
"click",
loadReviews
);

}









// ===============================
// LOGOUT
// ===============================

function logout(){

    localStorage.removeItem("token");

    window.location.href="login.html";

}



const logoutBtn =
document.getElementById("logoutBtn");


if(logoutBtn){

logoutBtn.addEventListener(
"click",
logout
);

}









// ===============================
// DATE FORMAT
// ===============================

function formatDate(date){


return new Date(date)
.toLocaleDateString(

"en-GB",

{

year:"numeric",

month:"short",

day:"numeric"

}

);


}









// ===============================
// EMPTY STATE
// ===============================

function showEmptyState(){


const table =
document.getElementById("reviewTable");


if(table){


table.innerHTML=`

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

()=>{

    loadReviews();

}

);