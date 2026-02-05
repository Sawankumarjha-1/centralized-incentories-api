// Import required modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

// Routes
import propertyRoutes from "./routes/property.routes.js";
import siteInventoryRoutes from "./routes/siteInventory.routes.js";

// Load environment variables
dotenv.config();

// DB Connection
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  }),
);

// Routes Mount
app.use("/api/properties", propertyRoutes);
app.use("/api/site-inventory", siteInventoryRoutes);
// Health check
app.get("/", (req, res) => {
  res.send("API running successfully 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
