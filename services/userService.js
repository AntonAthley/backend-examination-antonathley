import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByUsername,
  deleteUser,
} from "../models/userModel.js";
import { AppError } from "../utils/appError.js";
import { createJwtToken } from "../utils/jwtToken.js";
import { jwtConfig } from "../config/jwt.js";

/**
 * Handles the business logic for user registration.
 * Validates input, checks for existing users, hashes the password, creates a new user,
 * and generates a JWT.
 * @param {string} username - The desired username for the new account.
 * @param {string} password - The password for the new account.
 * @returns {Promise<object>} An object containing the new user's ID, username, and a JWT.
 * @throws {AppError} If username or password are missing/invalid, username already exists,
 * or user creation fails.
 */
export const signup = async (username, password) => {
  // Basic validation for username and password presence.
  if (!username || !password) {
    throw new AppError("Username and password are required.", 400);
  }
  // Basic validation for username length and password minimum length.
  if (username.length > 50 || password.length < 6) {
    throw new AppError("Invalid username or password format.", 400);
  }

  // Check if a user with the given username already exists in the database.
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    // If a user exists, throw a conflict error.
    throw new AppError("Username already exists.", 409);
  }

  // Generate a salt and hash the user's password for secure storage.
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Attempt to create the new user in the database with the hashed password.
  const newUser = await createUser(username, passwordHash);
  if (!newUser) {
    // If user creation fails for some reason, throw an internal server error.
    throw new AppError("Failed to create user. Please try again.", 500);
  }

  // Create a JSON Web Token (JWT) for the new user for authentication.
  // The token includes the user's ID, is signed with a secret, and has a defined lifetime and algorithm.
  const token = createJwtToken(
    newUser.id,
    jwtConfig.secret,
    jwtConfig.lifetime,
    jwtConfig.algorithm
  );

  // Return the new user's ID, username, and the generated token.
  return { id: newUser.id, username: newUser.username, token };
};

/**
 * Handles the business logic for user login.
 * Validates input, finds the user by username, compares passwords, and generates a JWT.
 * @param {string} username - The username provided for login.
 * @param {string} password - The password provided for login.
 * @returns {Promise<object>} An object containing the logged-in user's ID, username, and a JWT.
 * @throws {AppError} If username or password are missing, or credentials are invalid.
 */
export const login = async (username, password) => {
  // Basic validation for username and password presence.
  if (!username || !password) {
    throw new AppError("Username and password are required.", 400);
  }

  // Find the user in the database by their username.
  const user = await findUserByUsername(username);
  if (!user) {
    // If no user is found, throw an unauthorized error.
    throw new AppError("Invalid credentials.", 401);
  }

  // Compare the provided password with the stored hashed password.
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    // If passwords do not match, throw an unauthorized error.
    throw new AppError("Invalid credentials.", 401);
  }

  // Create a JSON Web Token (JWT) for the authenticated user.
  // The token includes the user's ID, is signed with a secret, and has a defined lifetime and algorithm.
  const token = createJwtToken(
    user.id,
    jwtConfig.secret,
    jwtConfig.lifetime,
    jwtConfig.algorithm
  );

  // Return the user's ID, username, and the generated token.
  return { id: user.id, username: user.username, token };
};

/**
 * Handles the business logic for deleting a user account.
 * Calls the userModel to delete the user from the database.
 * @param {string} userId - The ID of the user to be deleted.
 * @returns {Promise<boolean>} True if the user was successfully deleted.
 * @throws {AppError} If the user is not found or could not be deleted.
 */
export const deleteUserAccount = async (userId) => {
  // Attempt to delete the user from the database using their ID.
  const isDeleted = await deleteUser(userId);

  if (!isDeleted) {
    // If the user was not found or the deletion failed, throw a not found error.
    throw new AppError("User not found or could not be deleted.", 404);
  }

  // Return true if the user was successfully deleted.
  return true;
};
