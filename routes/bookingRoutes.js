const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    createBooking,
    getBookings,
    updateBookingStatus,
    deleteBooking
} = require("../controllers/bookingController");

// =====================================
// PUBLIC ROUTES
// =====================================

// Create Booking
router.post("/", createBooking);

// =====================================
// PROTECTED ROUTES
// =====================================

// Get All Bookings
router.get("/", auth, getBookings);

// Update Booking Status
router.put("/:id", auth, updateBookingStatus);

// Delete Booking
router.delete("/:id", auth, deleteBooking);

module.exports = router;