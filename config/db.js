import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

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
