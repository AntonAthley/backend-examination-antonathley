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

export { pool };
