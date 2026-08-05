const express = require("express");

const router = express.Router();


const authController =
require("../controllers/authController");


const auth =
require("../middleware/auth");




// =====================================
// AUTH ROUTES
// =====================================


// Register Admin
router.post(
    "/register",
    authController.register
);




// Login Admin
router.post(
    "/login",
    authController.login
);








// =====================================
// ADMIN PROFILE ROUTES
// =====================================


// Get Admin Profile

router.get(

    "/profile",

    auth,

    authController.getProfile

);







// Update Admin Profile

router.put(

    "/profile",

    auth,

    authController.updateProfile

);








// =====================================
// PASSWORD ROUTE
// =====================================


// Change Password

router.put(

    "/password",

    auth,

    authController.changePassword

);






module.exports = router;