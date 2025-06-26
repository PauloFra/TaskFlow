import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./db";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to TaskFlow API" });
});

// Health check endpoint
app.get("/health", async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: "ok",
    timestamp: new Date(),
    db: dbConnected ? "connected" : "disconnected",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  testConnection();
});
