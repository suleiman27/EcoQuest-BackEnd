// =======================================
// ECOQUEST ADMIN SETTINGS JS
// =======================================


// =======================================
// API CONFIGURATION
// =======================================

const API_URL =
    "https://ecoquest-backend-r4d4.onrender.com/api";


// =======================================
// GLOBAL ADMIN NAME HANDLER
// =======================================

function updateAdminName(username) {

    if (!username) return;

    localStorage.setItem(
        "adminName",
        username
    );

    const nameElements =
        document.querySelectorAll("#adminName");

    nameElements.forEach(element => {

        element.textContent = username;

    });

}


// =======================================
// LOAD ADMIN NAME
// =======================================

function loadAdminName() {

    const username =
        localStorage.getItem("adminName");

    const nameElements =
        document.querySelectorAll("#adminName");

    nameElements.forEach(element => {

        element.textContent =
            username || "Administrator";

    });

}


// =======================================
// CHECK AUTHENTICATION
// =======================================

function checkAuth() {

    const token =
        localStorage.getItem("token");

    if (!token) {

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

function authHeaders() {

    return {

        "Content-Type": "application/json",

        "Authorization":
            `Bearer ${token}`

    };

}


// =======================================
// LOAD ADMIN PROFILE
// =======================================

async function loadSettings() {

    try {

        console.log(
            "Loading admin profile..."
        );


        const response =
            await fetch(

                `${API_URL}/auth/profile`,

                {

                    method: "GET",

                    headers: authHeaders()

                }

            );


        console.log(
            "Profile HTTP status:",
            response.status
        );


        const admin =
            await response.json();


        console.log(
            "Profile response:",
            admin
        );


        if (response.status === 401) {

            logout();

            return;

        }


        if (!response.ok) {

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


        if (usernameField) {

            usernameField.value =
                admin.username || "";

            updateAdminName(
                admin.username
            );

        }


        if (emailField) {

            emailField.value =
                admin.email || "";

        }


    }

    catch (error) {

        console.error(
            "Load settings error:",
            error
        );


        alert(
            "Unable to load account settings."
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


if (settingsForm) {

    settingsForm.addEventListener(

        "submit",

        async (e) => {

            e.preventDefault();


            const usernameField =
                document.getElementById(
                    "adminName"
                );


            const emailField =
                document.getElementById(
                    "adminEmail"
                );


            const data = {

                username:
                    usernameField
                        ? usernameField.value.trim()
                        : "",

                email:
                    emailField
                        ? emailField.value.trim()
                        : ""

            };


            if (!data.username) {

                alert(
                    "Username cannot be empty."
                );

                return;

            }


            try {

                const response =
                    await fetch(

                        `${API_URL}/auth/profile`,

                        {

                            method: "PUT",

                            headers: authHeaders(),

                            body:
                                JSON.stringify(data)

                        }

                    );


                const result =
                    await response.json();


                console.log(
                    "Profile update response:",
                    result
                );


                if (response.status === 401) {

                    logout();

                    return;

                }


                if (response.ok) {

                    updateAdminName(
                        data.username
                    );


                    alert(
                        "Profile updated successfully."
                    );

                }

                else {

                    alert(

                        result.message ||

                        "Update failed."

                    );

                }


            }

            catch (error) {

                console.error(
                    "Profile update error:",
                    error
                );


                alert(
                    "Server connection error."
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


if (passwordForm) {

    passwordForm.addEventListener(

        "submit",

        async (e) => {

            e.preventDefault();


            const oldPassword =
                document.getElementById(
                    "oldPassword"
                );


            const newPassword =
                document.getElementById(
                    "newPassword"
                );


            const data = {

                currentPassword:
                    oldPassword
                        ? oldPassword.value
                        : "",

                newPassword:
                    newPassword
                        ? newPassword.value
                        : ""

            };


            if (
                !data.currentPassword ||
                !data.newPassword
            ) {

                alert(
                    "Please fill in both password fields."
                );

                return;

            }


            try {

                const response =
                    await fetch(

                        `${API_URL}/auth/password`,

                        {

                            method: "PUT",

                            headers: authHeaders(),

                            body:
                                JSON.stringify(data)

                        }

                    );


                const result =
                    await response.json();


                console.log(
                    "Password update response:",
                    result
                );


                if (response.status === 401) {

                    logout();

                    return;

                }


                if (response.ok) {

                    alert(
                        "Password changed successfully."
                    );


                    passwordForm.reset();

                }

                else {

                    alert(

                        result.message ||

                        "Password change failed."

                    );

                }


            }

            catch (error) {

                console.error(
                    "Password change error:",
                    error
                );


                alert(
                    "Server error."
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


if (themeToggle) {

    themeToggle.addEventListener(

        "change",

        () => {

            if (themeToggle.checked) {

                document.body.classList.add(
                    "dark-mode"
                );


                localStorage.setItem(
                    "theme",
                    "dark"
                );

            }

            else {

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

function loadTheme() {

    const theme =
        localStorage.getItem(
            "theme"
        );


    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );


        if (themeToggle) {

            themeToggle.checked = true;

        }

    }

}


// =======================================
// LOGOUT
// =======================================

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "adminName"
    );

    window.location.href =
        "../login.html";

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


// =======================================
// INITIAL LOAD
// =======================================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadSettings();

        loadAdminName();

        loadTheme();

    }

);
