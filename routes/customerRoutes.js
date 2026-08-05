const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    getCustomers,
    deleteCustomer
} = require("../controllers/customerController");

// =====================================
// PROTECTED ROUTES
// =====================================

// Get All Customers
router.get("/", auth, getCustomers);

// Delete Customer
router.delete("/:id", auth, deleteCustomer);

module.exports = router;