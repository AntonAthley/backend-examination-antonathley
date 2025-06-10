import { pool } from "../config/db.js";
import { AppError } from "../utils/appError.js";

/**
 * Inserts a new user into the 'users' table in the database.
 * @param {string} username - The username of the new user.
 * @param {string} passwordHash - The hashed password of the new user.
 * @returns {Promise<object | null>} A promise that resolves to the created user object (id, username, created_at)
 *                                   or null if the user could not be created.
 * @throws {AppError} If there is a database error during user creation.
 */
export const createUser = async (username, passwordHash) => {
  try {
    // SQL query to insert a new user. It returns the id, username, and creation timestamp.
    const query = `
      INSERT INTO users (username, password_hash)
      VALUES ($1, $2)
      RETURNING id, username, created_at;
    `;
    // Values to be inserted into the query.
    const values = [username, passwordHash];
    // Execute the query using the database connection pool.
    const result = await pool.query(query, values);
    // Return the first row of the result, which is the newly created user, or null if no row was returned.
    return result.rows[0] || null;
  } catch (error) {
    // Log the error for debugging purposes.
    console.error("Error in createUser:", error.message);
    // Re-throw an AppError with a 500 status code for database errors.
    throw new AppError("Could not create user.", 500);
  }
};

/**
 * Retrieves a user from the 'users' table based on their username.
 * @param {string} username - The username to search for.
 * @returns {Promise<object | null>} A promise that resolves to the user object (id, username, password_hash, created_at)
 *                                   or null if no user is found with the given username.
 * @throws {AppError} If there is a database error during user retrieval.
 */
export const findUserByUsername = async (username) => {
  try {
    // SQL query to select a user by their username.
    const query = `
      SELECT id, username, password_hash, created_at
      FROM users
      WHERE username = $1;
    `;
    // Values to be used in the query.
    const values = [username];
    // Execute the query.
    const result = await pool.query(query, values);
    // Return the first row (the user) or null if no user is found.
    return result.rows[0] || null;
  } catch (error) {
    // Log the error.
    console.error("Error in findUserByUsername:", error.message);
    // Re-throw an AppError with a 500 status code for database errors.
    throw new AppError("Could not retrieve user.", 500);
  }
};

/**
 * Deletes a user from the 'users' table based on their user ID.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the user was successfully deleted,
 *                                  false otherwise (e.g., user not found).
 * @throws {AppError} If there is a database error during user deletion.
 */
export const deleteUser = async (userId) => {
  try {
    // SQL query to delete a user by their ID.
    const query = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id;
    `;
    // Values to be used in the query.
    const values = [userId];
    // Execute the query.
    const result = await pool.query(query, values);
    // Return true if at least one row was affected (meaning a user was deleted), otherwise false.
    return result.rowCount > 0;
  } catch (error) {
    // Log the error.
    console.error("Error in deleteUser:", error.message);
    // Re-throw an AppError with a 500 status code for database errors.
    throw new AppError("Could not delete user.", 500);
  }
};
