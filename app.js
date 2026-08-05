require("dotenv").config();

const express = require("express");
const cors = require("cors");

const bookingRoutes = require("./routes/bookingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const customerRoutes = require("./routes/customerRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();

// ===============================
// Middleware
// ===============================
app.use(cors({
    origin: [
        "https://suleiman27.github.io",
        "https://ecoquest-1-12jk.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// API Routes
// ===============================
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/settings", settingsRoutes);

// ===============================
// Home Route
// ===============================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 EcoQuest Backend API is running."
    });
});

// ===============================
// 404 Route
// ===============================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found."
    });
});

// ===============================
// Global Error Handler
// ===============================
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});