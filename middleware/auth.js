import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import { jwtConfig } from "../config/jwt.js";

/**
 * Middleware function to authenticate requests using JSON Web Tokens (JWT).
 * It checks for a 'Bearer' token in the Authorization header, verifies its validity,
 * and attaches the decoded user ID to the request object (`req.user.id`).
 * If the token is missing, invalid, or expired, it throws an `AppError`.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the Express pipeline.
 */
export const authMiddleware = (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract the token from the "Bearer <token>" string.
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token is found, return an unauthorized error.
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  try {
    // Verify the token using the secret key from jwtConfig.
    // This decodes the token and checks its signature and expiration.
    const decoded = jwt.verify(token, jwtConfig.secret);

    // Attach the decoded user ID to the request object, making it accessible in subsequent middleware or route handlers.
    req.user = { id: decoded.id };

    // Call the next middleware or route handler.
    next();
  } catch (error) {
    // Handle different types of JWT errors.
    if (error.name === "JsonWebTokenError") {
      // If the token is malformed or invalid.
      return next(new AppError("Invalid token. Please log in again.", 401));
    }
    if (error.name === "TokenExpiredError") {
      // If the token has expired.
      return next(
        new AppError("Your token has expired! Please log in again.", 401)
      );
    }
    // For any other authentication failure.
    return next(new AppError("Failed to authenticate token.", 401));
  }
};
