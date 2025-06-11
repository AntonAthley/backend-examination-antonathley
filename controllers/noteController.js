import * as noteService from "../services/noteService.js";
import { AppError } from "../utils/appError.js";
import {
  validate,
  createNoteSchema,
  updateNoteSchema,
} from "../utils/validation.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Generated unique ID for the note.
 *           example: 1a2b3c4d-5e6f-7890-abcd-ef0123456789
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID of the user who owns the note.
 *           example: a1b2c3d4-e5f6-7890-1234-567890abcdef
 *         title:
 *           type: string
 *           description: Title of the note (max 50 chars).
 *           example: My Awesome Note
 *         text:
 *           type: string
 *           description: Content of the note (max 300 chars).
 *           example: This is the text of the note. It can be quite long, but not too long!
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the note was created.
 *           example: 2024-05-15T10:00:00.000Z
 *         modified_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the note was last modified.
 *           example: 2024-05-15T11:30:00.000Z
 *     CreateNoteRequest:
 *       type: object
 *       required:
 *         - title
 *         - text
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the note (max 50 chars).
 *           example: My First Note
 *         text:
 *           type: string
 *           description: Content of the note (max 300 chars).
 *           example: This is the text content of my very first note. It's quite interesting.
 *     UpdateNoteRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: New title for the note (max 50 chars).
 *           example: Updated Note Title
 *         text:
 *           type: string
 *           description: New content for the note (max 300 chars).
 *           example: The text content has been updated for this note.
 *       minProperties: 1
 *       description: At least one of 'title' or 'text' must be provided.
 */

/**
 * Retrieves all notes for the authenticated user.
 * @param {object} req - The Express request object, containing `req.user.id`.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
export const getNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notes = await noteService.getNotesService(userId);
    res.status(200).json({
      status: "success",
      message: "Notes retrieved successfully!",
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new note for the authenticated user.
 * @param {object} req - The Express request object, with `req.user.id` and note data in body.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
export const createNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, text } = validate(createNoteSchema, req.body);

    const newNote = await noteService.createNoteService(userId, title, text);

    res.status(201).json({
      status: "success",
      message: "Note created successfully!",
      data: newNote,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing note belonging to the authenticated user.
 * Note ID is passed as a query parameter for PUT requests.
 * @param {object} req - The Express request object, with `req.user.id`, note ID in query, and updates in body.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
export const updateNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.query.id;

    if (!noteId) {
      throw new AppError(
        "Note ID is required as a query parameter (e.g., ?id=...)",
        400
      );
    }

    const updates = validate(updateNoteSchema, req.body);

    if (Object.keys(updates).length === 0) {
      throw new AppError(
        "No valid fields provided for update (title or text).",
        400
      );
    }

    const updatedNote = await noteService.updateNoteService(
      noteId,
      userId,
      updates
    );

    res.status(200).json({
      status: "success",
      message: "Note updated successfully!",
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a note belonging to the authenticated user.
 * Note ID is passed as a query parameter for DELETE requests.
 * @param {object} req - The Express request object, with `req.user.id` and note ID in query.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
export const deleteNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.query.id;

    if (!noteId) {
      throw new AppError(
        "Note ID is required as a query parameter (e.g., ?id=...)",
        400
      );
    }

    await noteService.deleteNoteService(noteId, userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Searches for notes by title for the authenticated user.
 * Search term is passed as a query parameter.
 * @param {object} req - The Express request object, with `req.user.id` and search query in `req.query.q`.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
export const searchNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const searchTerm = req.query.q;

    if (!searchTerm || searchTerm.trim() === "") {
      throw new AppError("Search query (q) is required.", 400);
    }

    const notes = await noteService.searchNotesService(userId, searchTerm);

    let message = "Notes found successfully!";
    if (notes.length === 0) {
      message = "No notes found matching your search criteria.";
    }

    res.status(200).json({
      status: "success",
      message: message,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};
