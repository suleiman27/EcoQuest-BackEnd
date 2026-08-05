const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");


const {

    createReview,
    getReviews,
    getAllReviews,
    approveReview,
    deleteReview

} = require("../controllers/reviewController");



// ==========================================
// PUBLIC ROUTES
// ==========================================


// Submit review

router.post(
    "/",
    createReview
);



// Get approved reviews for website

router.get(
    "/",
    getReviews
);





// ==========================================
// ADMIN ROUTES
// ==========================================


// Get all reviews (pending + approved)

router.get(
    "/admin/all",
    auth,
    getAllReviews
);



// Approve review

router.put(
    "/approve/:id",
    auth,
    approveReview
);



// Delete review

router.delete(
    "/:id",
    auth,
    deleteReview
);





module.exports = router;