import dns from "dns";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";
import verticalRoutes from "./routes/verticalRoutes.js";

// Load environment variables
dotenv.config();

// Fix MongoDB Atlas SRV DNS resolution
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

// =========================
// Middleware
// =========================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// =========================
// Database
// =========================

connectDB();

// =========================
// Routes
// =========================

app.use("/api/projects", projectRoutes);

app.use("/api/verticals", verticalRoutes);

// =========================
// Root Route
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DRDO Project Monitoring API is running",
  });
});

// =========================
// Local Server
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
