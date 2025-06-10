import pg from "pg";
import dotenv from "dotenv";

// Load environment variables from .env file.
dotenv.config();

// Destructure Pool from the pg (node-postgres) library.
const { Pool } = pg;

// Create a new PostgreSQL connection pool.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Doesn't work without false, FIX THIS
  },
});

//Test for connection - remove later
export const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL database connected successfully!");
  } catch (err) {
    console.error("PostgreSQL database connection FAILED:", err.message);
    process.exit(1);
  }
};

export { pool };
