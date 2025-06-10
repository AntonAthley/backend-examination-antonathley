import dotenv from "dotenv";

// Load environment variables from .env file.
dotenv.config();

// Configuration object for JSON Web Token (JWT) settings.

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  lifetime: process.env.JWT_LIFETIME || "1h",
  algorithm: "HS256",
};
