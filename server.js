import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swaggerConfig.js";

// Load environment variables from a .env file into process.env.
dotenv.config();

// Initialize the Express application.
const app = express();
// Define the port for the server to listen on, using environment variable or defaulting to 5000.
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies from incoming requests.
app.use(express.json());

// Middleware to enable Cross-Origin Resource Sharing (CORS).
app.use(cors());

connectDB(); //TEST - remove later

// Routes
app.use("/api/user", userRoutes);

// Serve Swagger API documentation.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start page
app.get("/", (req, res) => {
  res.send("Swing Notes API is running!");
});

// Global error handling middleware.
app.use(errorHandler);

// Start the Express server.
app.listen(PORT, () => {
  console.log(`Open http://localhost:${PORT}`);
});
