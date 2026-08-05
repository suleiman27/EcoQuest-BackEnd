require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

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
        "https://ecoquest-1-12jk.onrender.com",
        "https://suleiman27.github.io"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Serve Frontend Files
// ===============================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "admin/pages")));

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
app.use("/api/settings", settingsRoutes);

// ===============================
// Home Route
// ===============================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});