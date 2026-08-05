const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
    createContact,
    getContacts
} = require("../controllers/contactController");

// Public - Anyone can send a message
router.post("/", createContact);

// Protected - Only admin can view messages
router.get("/", auth, getContacts);

module.exports = router;