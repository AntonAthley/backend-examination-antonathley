/**
 * @swagger
 * components:
 *   schemas:
 *     SignupRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Unique username for the account.
 *           example: john_doe
 *         password:
 *           type: string
 *           description: Password for the account (min 6 characters).
 *           example: securepassword123
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Username of the account.
 *           example: john_doe
 *         password:
 *           type: string
 *           description: Password for the account.
 *           example: securepassword123
 *     AuthSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: User registered successfully!
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: a1b2c3d4-e5f6-7890-1234-567890abcdef
 *             username:
 *               type: string
 *               example: john_doe
 *             token:
 *               type: string
 *               description: "JSON Web Token for authentication."
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 */

import * as userService from "../services/userService.js";
import { validate, signupSchema, loginSchema } from "../utils/validation.js";
import { AppError } from "../utils/appError.js";

/**
 * Handles user registration.
 * Validates the request body, calls the userService to create a new user,
 * and sends back a success response with user data and a JWT.
 * If an error occurs, it is passed to the next middleware.
 * @param {object} req - The Express request object, containing username and password in the body.
 * @param {object} res - The Express response object, used to send back the API response.
 * @param {function} next - The next middleware function in the Express pipeline.
 */

export const signup = async (req, res, next) => {
  try {
    // Validate request body against signupSchema using Joi.
    const { username, password } = validate(signupSchema, req.body);

    // Call the userService to handle the signup logic, which includes hashing the password
    // and creating the user in the database, and generating a JWT.
    const userData = await userService.signup(username, password);

    // If signup is successful, send a 201 Created status with user details and the token.
    res.status(201).json({
      status: "success",
      message: "User registered successfully!",
      data: {
        id: userData.id,
        username: userData.username,
        token: userData.token,
      },
    });
  } catch (error) {
    // Pass any errors to the Express error handling middleware.
    next(error);
  }
};

/**
 * Handles user login.
 * Validates the request body, calls the userService to authenticate the user,
 * and sends back a success response with user data and a JWT.
 * If an error occurs, it is passed to the next middleware.
 * @param {object} req - The Express request object, containing username and password in the body.
 * @param {object} res - The Express response object, used to send back the API response.
 * @param {function} next - The next middleware function in the Express pipeline.
 */
export const login = async (req, res, next) => {
  try {
    // Validate request body against loginSchema using Joi.
    const { username, password } = validate(loginSchema, req.body);

    // Call the userService to handle the login logic, which includes verifying credentials
    // and generating a JWT.
    const userData = await userService.login(username, password);

    // If login is successful, send a 200 OK status with user details and the token.
    res.status(200).json({
      status: "success",
      message: "User logged in successfully!",
      data: {
        id: userData.id,
        username: userData.username,
        token: userData.token,
      },
    });
  } catch (error) {
    // Pass any errors to the Express error handling middleware.
    next(error);
  }
};

/**
 * Handles deletion of the currently authenticated user's account.
 * Extracts the user ID from the request (set by `authMiddleware`),
 * calls the userService to delete the user, and sends a 204 No Content response.
 * If an error occurs (e.g., user not found or ID missing), it is passed to the next middleware.
 * @param {object} req - The Express request object, expected to have `req.user.id` from `authMiddleware`.
 * @param {object} res - The Express response object, used to send back the API response.
 * @param {function} next - The next middleware function in the Express pipeline.
 */
export const deleteCurrentUser = async (req, res, next) => {
  try {
    // Extract the user ID from the request object, which is populated by the authentication middleware.
    const userId = req.user.id;

    // If no user ID is found (which shouldn't happen if authMiddleware is correctly applied),
    // throw an AppError.
    if (!userId) {
      throw new AppError("User ID not found in token.", 400);
    }

    // Call the userService to delete the user account from the database.
    await userService.deleteUserAccount(userId);

    // If deletion is successful, send a 204 No Content status, indicating successful operation
    // without returning any body.
    res.status(204).send();
  } catch (error) {
    // Pass any errors to the Express error handling middleware.
    next(error);
  }
};
