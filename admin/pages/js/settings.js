// =======================================
// EcoQuest Admin Settings JS
// =======================================


const API_URL = "https://ecoquest-1-12jk.onrender.com";




// =======================================
// GLOBAL ADMIN NAME HANDLER
// =======================================


function updateAdminName(username){


    if(!username) return;


    localStorage.setItem(

        "adminName",

        username

    );



    const nameElements =
    document.querySelectorAll("#adminName");



    nameElements.forEach(element=>{


        element.textContent = username;


    });



}





function loadAdminName(){


    const username =
    localStorage.getItem("adminName");



    const nameElements =
    document.querySelectorAll("#adminName");



    nameElements.forEach(element=>{


        element.textContent =

        username || "Administrator";


    });



}







// =======================================
// CHECK AUTHENTICATION
// =======================================


function checkAuth(){


    const token =
    localStorage.getItem("token");



    if(!token){


        window.location.href =
        "../login.html";


        return null;


    }



    return token;


}



const token = checkAuth();







// =======================================
// AUTH HEADERS
// =======================================


function authHeaders(){


    return {


        "Content-Type":"application/json",


        "Authorization":
        `Bearer ${token}`


    };


}







// =======================================
// LOAD ADMIN PROFILE
// =======================================


async function loadSettings(){


    try{


        const response =
        await fetch(

            `${API_URL}/auth/profile`,

            {

                method:"GET",

                headers:authHeaders()

            }

        );





        const admin =
        await response.json();





        if(!response.ok){


            throw new Error(

                admin.message ||

                "Failed to load profile"

            );


        }







        const usernameField =
        document.getElementById(
            "adminName"
        );



        const emailField =
        document.getElementById(
            "adminEmail"
        );







        if(usernameField){


            usernameField.value =

            admin.username || "";



            updateAdminName(

                admin.username

            );


        }







        if(emailField){


            emailField.value =

            admin.email || "";


        }






    }


    catch(error){


        console.error(error);



        alert(

            "Unable to load account settings"

        );


    }


}









// =======================================
// UPDATE PROFILE
// =======================================



const settingsForm =
document.getElementById(
    "settingsForm"
);





if(settingsForm){



settingsForm.addEventListener(

"submit",



async(e)=>{



e.preventDefault();





const data = {



username:

document.getElementById(
"adminName"
).value,




email:

document.getElementById(
"adminEmail"
).value



};








try{



const response =

await fetch(

`${API_URL}/auth/profile`,

{


method:"PUT",


headers:authHeaders(),


body:JSON.stringify(data)


}

);







const result =
await response.json();







if(response.ok){



// Update everywhere

updateAdminName(

data.username

);





alert(

"Profile updated successfully"

);



}



else{



alert(

result.message ||

"Update failed"

);



}






}



catch(error){



console.error(error);



alert(

"Server connection error"

);



}



}



);



}











// =======================================
// CHANGE PASSWORD
// =======================================



const passwordForm =
document.getElementById(
"passwordForm"
);






if(passwordForm){



passwordForm.addEventListener(



"submit",



async(e)=>{



e.preventDefault();







const data = {



currentPassword:


document.getElementById(
"oldPassword"
).value,





newPassword:


document.getElementById(
"newPassword"
).value




};







try{



const response =

await fetch(

`${API_URL}/auth/password`,

{


method:"PUT",


headers:authHeaders(),


body:JSON.stringify(data)


}

);







const result =
await response.json();







if(response.ok){



alert(

"Password changed successfully"

);



passwordForm.reset();



}



else{



alert(

result.message ||

"Password change failed"

);



}





}



catch(error){



console.error(error);



alert(

"Server error"

);



}



}



);



}











// =======================================
// DARK MODE TOGGLE
// =======================================


const themeToggle =
document.getElementById(
"themeToggle"
);






if(themeToggle){



themeToggle.addEventListener(



"change",



()=>{



if(themeToggle.checked){



document.body.classList.add(

"dark-mode"

);



localStorage.setItem(

"theme",

"dark"

);



}



else{



document.body.classList.remove(

"dark-mode"

);



localStorage.setItem(

"theme",

"light"

);



}



}



);



}









// =======================================
// LOAD SAVED THEME
// =======================================



function loadTheme(){



const theme =

localStorage.getItem(
"theme"
);





if(theme==="dark"){



document.body.classList.add(

"dark-mode"

);




if(themeToggle){


themeToggle.checked = true;


}



}



}











// =======================================
// LOGOUT
// =======================================



const logoutBtn =
document.getElementById(
"logoutBtn"
);






if(logoutBtn){



logoutBtn.addEventListener(



"click",



()=>{



localStorage.removeItem(
"token"
);



localStorage.removeItem(
"adminName"
);



window.location.href =

"../login.html";



}



);



}









// =======================================
// INITIAL LOAD
// =======================================



document.addEventListener(



"DOMContentLoaded",



()=>{



loadSettings();


loadAdminName();


loadTheme();



}



);