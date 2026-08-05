const express = require("express");
const router = express.Router();

const {
    getSettings,
    updateProfile,
    changePassword,
    updatePreferences,
    logoutAll
} = require("../controllers/settingsController");

// Get all settings
router.get("/", getSettings);

// Update admin profile
router.put("/profile", updateProfile);

// Change password
router.put("/password", changePassword);

// Update notification preferences
router.put("/preferences", updatePreferences);

// Logout all devices
router.post("/logout-all", logoutAll);

module.exports = router;