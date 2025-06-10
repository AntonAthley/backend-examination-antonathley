import { AppError } from "../utils/appError.js";

/**
 * Global error handling middleware for Express applications.
 * This middleware catches errors passed by `next(error)` calls in routes or other middleware.
 * It determines the appropriate HTTP status code and message based on the error type,
 * and sends a standardized JSON error response to the client.
 * @param {Error} err - The error object caught from the application.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object, used to send the error response.
 * @param {function} next - The next middleware function (though typically not called in a terminal error handler).
 */
export const errorHandler = (err, req, res, next) => {
  // Log the full error object to the console for debugging purposes.
  console.error("ERROR: ", err);

  // Initialize default status code, message, and status for generic errors.
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  let status = err.status || "error";

  // If the error is an instance of AppError (a custom operational error),
  // use its specific statusCode, message, and status.
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    status = err.status;
  } else if (
    // Handle specific database error for duplicate key violations (e.g., unique username constraint).
    // '23505' is the PostgreSQL error code for unique_violation.
    err.code === "23505" &&
    err.constraint &&
    err.constraint.includes("username")
  ) {
    statusCode = 409; // Conflict status code.
    message = "Username already exists.";
    status = "fail"; // Indicate a client-side failure.
  }

  // Send the error response to the client with the determined status code and JSON body.
  res.status(statusCode).json({
    status: status,
    message: message,
  });
};
