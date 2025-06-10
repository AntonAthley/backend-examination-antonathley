import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("Swing Notes API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT}`);
});
