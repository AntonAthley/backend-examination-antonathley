/**
 * Custom error class extending the built-in Error class.
 * This class is used to create operational errors (expected errors) in the application,
 * allowing for standardized error handling with specific HTTP status codes and messages.
 */
export class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * @param {string} message - The error message that will be sent to the client.
   * @param {number} statusCode - The HTTP status code associated with this error (e.g., 400, 401, 404, 500).
   */
  constructor(message, statusCode) {
    // Call the parent Error constructor with the message.
    super(message);
    // Store the HTTP status code.
    this.statusCode = statusCode;
    // Determine the status string ('fail' for 4xx errors, 'error' for 5xx errors).
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // Mark this error as operational, meaning it's a predictable error and not a programming bug.
    this.isOperational = true;
    // Capture the stack trace, excluding the constructor call, to get cleaner error logs.
    Error.captureStackTrace(this, this.constructor);
  }
}
