import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";

import routingRoutes from "./routes/routingRoutes.js";

import weatherRoutes from "./routes/weatherRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";


const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// ===============================
// BASIC TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BharatYatra Backend is running 🚀",
  });
});

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/search", searchRoutes);

app.use("/api/destination", destinationRoutes);

app.use("/api/route", routingRoutes);

app.use("/api/weather", weatherRoutes);

app.use("/api/trips", tripRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/feedback", feedbackRoutes);

// ===============================
// EXPORT
// ===============================

export default app;