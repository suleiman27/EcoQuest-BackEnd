function loadAdminName(){

    const adminName = localStorage.getItem("adminName");

    const elements = document.querySelectorAll("#adminName");


    elements.forEach(element => {

        element.textContent = adminName || "Administrator";

    });

}
    

document.addEventListener("DOMContentLoaded", ()=>{

    loadAdminName();

});