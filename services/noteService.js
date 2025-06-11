import {
  createNote,
  getNotesByUserId,
  updateNote,
  deleteNote,
  searchNotesByTitle,
  getNoteByIdAndUserId,
} from "../models/noteModel.js";
import { AppError } from "../utils/appError.js";

/**
 * Creates a new note for a given user.
 * @param {string} userId - The ID of the user creating the note.
 * @param {string} title - The title of the note.
 * @param {string} text - The content of the note.
 * @returns {Promise<object>} - The created note object.
 * @throws {AppError} If note creation fails.
 */
export const createNoteService = async (userId, title, text) => {
  const newNote = await createNote(userId, title, text);
  if (!newNote) {
    throw new AppError("Failed to create note. Please try again.", 500);
  }
  return newNote;
};

/**
 * Retrieves all notes for a specific user.
 * @param {string} userId - The ID of the user whose notes to retrieve.
 * @returns {Promise<Array<object>>} - An array of note objects.
 * @throws {AppError} If retrieval fails.
 */
export const getNotesService = async (userId) => {
  const notes = await getNotesByUserId(userId);
  return notes;
};

/**
 * Updates an existing note.
 * Ensures the note exists and belongs to the user before attempting update.
 * @param {string} noteId - The ID of the note to update.
 * @param {string} userId - The ID of the user attempting to update.
 * @param {object} updates - An object with fields to update (title, text).
 * @returns {Promise<object>} - The updated note object.
 * @throws {AppError} If note not found, not owned by user, or update fails.
 */
export const updateNoteService = async (noteId, userId, updates) => {
  // Optional: Check if the note exists and belongs to the user BEFORE attempting update
  // This can provide a more specific error message (404 vs 403 vs 500)
  const existingNote = await getNoteByIdAndUserId(noteId, userId);
  if (!existingNote) {
    // If note is not found OR if it doesn't belong to the user
    throw new AppError(
      "Note not found or you do not have permission to update it.",
      404
    );
  }

  const updatedNote = await updateNote(noteId, userId, updates);
  if (!updatedNote) {
    // This could happen if the note was found initially but update failed for some other reason
    throw new AppError("Failed to update note. Please try again.", 500);
  }
  return updatedNote;
};

/**
 * Deletes a note.
 * Ensures the note exists and belongs to the user before attempting deletion.
 * @param {string} noteId - The ID of the note to delete.
 * @param {string} userId - The ID of the user attempting to delete.
 * @returns {Promise<boolean>} - True if deletion is successful.
 * @throws {AppError} If note not found, not owned by user, or deletion fails.
 */
export const deleteNoteService = async (noteId, userId) => {
  // Similar ownership check as in updateNoteService
  const existingNote = await getNoteByIdAndUserId(noteId, userId);
  if (!existingNote) {
    throw new AppError(
      "Note not found or you do not have permission to delete it.",
      404
    );
  }

  const isDeleted = await deleteNote(noteId, userId);
  if (!isDeleted) {
    throw new AppError("Failed to delete note. Please try again.", 500);
  }
  return true; // Return true on success
};

/**
 * Searches for notes by title for a specific user.
 * @param {string} userId - The ID of the user performing the search.
 * @param {string} searchTerm - The search query for titles.
 * @returns {Promise<Array<object>>} - An array of matching note objects.
 * @throws {AppError} If search fails.
 */
export const searchNotesService = async (userId, searchTerm) => {
  const notes = await searchNotesByTitle(userId, searchTerm);
  return notes;
};
