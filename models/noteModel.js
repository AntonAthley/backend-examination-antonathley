import { pool } from "../config/db.js";
import { AppError } from "../utils/appError.js";

/**
 * Creates a new note in the database for a specific user.
 * @param {string} userId - The ID of the user who owns the note.
 * @param {string} title - The title of the note.
 * @param {string} text - The text content of the note.
 * @returns {Promise<object | null>} - A promise that resolves to the created note object or null.
 * @throws {AppError} If there is a database error.
 */
export const createNote = async (userId, title, text) => {
  try {
    const query = `
      INSERT INTO notes (user_id, title, text)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, title, text, created_at, modified_at;
    `;
    const values = [userId, title, text];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error in createNote:", error.message);
    throw new AppError("Could not create note.", 500);
  }
};

/**
 * Retrieves all notes for a specific user from the database.
 * @param {string} userId - The ID of the user whose notes are to be retrieved.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of note objects.
 * @throws {AppError} If there is a database error.
 */
export const getNotesByUserId = async (userId) => {
  try {
    const query = `
      SELECT id, user_id, title, text, created_at, modified_at
      FROM notes
      WHERE user_id = $1
      ORDER BY modified_at DESC;
    `;
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error in getNotesByUserId:", error.message);
    throw new AppError("Could not retrieve notes.", 500);
  }
};

/**
 * Updates an existing note in the database.
 * Only allows updating title and/or text. Ensures the note belongs to the specified user.
 * @param {string} id - The ID of the note to update.
 * @param {string} userId - The ID of the user who owns the note (for ownership check).
 * @param {object} updates - An object containing the fields to update (e.g., { title: 'New Title' }).
 * @returns {Promise<object | null>} - A promise that resolves to the updated note object or null if not found/owned.
 * @throws {AppError} If there is a database error.
 */
export const updateNote = async (id, userId, updates) => {
  try {
    const setClauses = [];
    const values = [id, userId];
    let valueIndex = 3; // Start from 3 because $1 is id, $2 is userId

    // Dynamically build the SET based on provided updates
    if (updates.title !== undefined) {
      setClauses.push(`title = $${valueIndex++}`);
      values.push(updates.title);
    }
    if (updates.text !== undefined) {
      setClauses.push(`text = $${valueIndex++}`);
      values.push(updates.text);
    }

    if (setClauses.length === 0) {
      return null;
    }

    const query = `
      UPDATE notes
      SET ${setClauses.join(", ")}
      WHERE id = $1 AND user_id = $2
      RETURNING id, user_id, title, text, created_at, modified_at;
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error in updateNote:", error.message);
    throw new AppError("Could not update note.", 500);
  }
};

/**
 * Deletes a note from the database. Ensures the note belongs to the specified user.
 * @param {string} id - The ID of the note to delete.
 * @param {string} userId - The ID of the user who owns the note (for ownership check).
 * @returns {Promise<boolean>} - True if the note was deleted, otherwise false.
 * @throws {AppError} If there is a database error.
 */
export const deleteNote = async (id, userId) => {
  try {
    const query = `
      DELETE FROM notes
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;
    const values = [id, userId];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error in deleteNote:", error.message);
    throw new AppError("Could not delete note.", 500);
  }
};

/**
 * Searches for notes by title for a specific user.
 * The search is case-insensitive and supports partial matches.
 * @param {string} userId - The ID of the user whose notes are to be searched.
 * @param {string} searchTerm - The term to search for in note titles.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of matching note objects.
 * @throws {AppError} If there is a database error.
 */
export const searchNotesByTitle = async (userId, searchTerm) => {
  try {
    const query = `
      SELECT id, user_id, title, text, created_at, modified_at
      FROM notes
      WHERE user_id = $1 AND title ILIKE $2
      ORDER BY modified_at DESC;
    `;
    // Use ILIKE for case-insensitive partial match
    const values = [userId, `%${searchTerm}%`];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error in searchNotesByTitle:", error.message);
    throw new AppError("Could not search notes.", 500);
  }
};

// You might want to add a utility function to fetch a single note by ID (and userId)
// if individual note details are needed without affecting the "get all notes" endpoint.
export const getNoteByIdAndUserId = async (noteId, userId) => {
  try {
    const query = `
      SELECT id, user_id, title, text, created_at, modified_at
      FROM notes
      WHERE id = $1 AND user_id = $2;
    `;
    const values = [noteId, userId];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error in getNoteByIdAndUserId:", error.message);
    throw new AppError("Could not retrieve note by ID.", 500);
  }
};
