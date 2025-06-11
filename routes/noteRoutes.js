import { Router } from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
} from "../controllers/noteController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Operations related to user notes
 */

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes for the authenticated user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: "success" }
 *                 message: { type: string, example: "Notes retrieved successfully!" }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNoteRequest'
 *     responses:
 *       201:
 *         description: Note created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: "success" }
 *                 message: { type: string, example: "Note created successfully!" }
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request (e.g., invalid title/text length).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               InvalidInput:
 *                 summary: Invalid Title or Text Format
 *                 value:
 *                   status: "fail"
 *                   message: "Title must be at least 1 character long., Text cannot exceed 300 characters."
 *               MissingFields:
 *                 summary: Missing Title or Text
 *                 value:
 *                   status: "fail"
 *                   message: "Title is required., Text is required."
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   put:
 *     summary: Update an existing note
 *     description: Updates a note by its ID. User must own the note. Note ID is passed as a query parameter.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: ID of the note to update.
 *         schema:
 *           type: string
 *           format: "uuid"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNoteRequest'
 *     responses:
 *       200:
 *         description: Note updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: "success" }
 *                 message: { type: string, example: "Note updated successfully!" }
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request (e.g., invalid input, missing note ID).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               MissingNoteId:
 *                 summary: Missing Note ID
 *                 value:
 *                   status: "fail"
 *                   message: "Note ID is required as a query parameter (e.g., ?id=...)"
 *               NoFieldsToUpdate:
 *                 summary: No Valid Fields for Update
 *                 value:
 *                   status: "fail"
 *                   message: "No valid fields provided for update (title or text)."
 *               InvalidFormat:
 *                 summary: Invalid Title/Text Format
 *                 value:
 *                   status: "fail"
 *                   message: "Title must be at least 1 character long."
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Note not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               NoteNotFound:
 *                 summary: Note Not Found or Unauthorized
 *                 value:
 *                   status: "fail"
 *                   message: "Note not found or you do not have permission to update it."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   delete:
 *     summary: Delete a note
 *     description: Deletes a note by its ID. User must own the note. Note ID is passed as a query parameter.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: ID of the note to delete.
 *         schema:
 *           type: string
 *           format: "uuid"
 *     responses:
 *       204:
 *         description: Note deleted successfully. No content returned for 204.
 *         content: {}
 *       400:
 *         description: Bad request (e.g., missing note ID).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               MissingNoteId:
 *                 summary: Missing Note ID
 *                 value:
 *                   status: "fail"
 *                   message: "Note ID is required as a query parameter (e.g., ?id=...)"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Note not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples: # <--- REUSING 404 example for delete
 *               NoteNotFound:
 *                 summary: Note Not Found or Unauthorized
 *                 value:
 *                   status: "fail"
 *                   message: "Note not found or you do not have permission to delete it."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 * /notes/search:
 *   get:
 *     summary: Search notes by title for the authenticated user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         description: Search term for note titles.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved search results.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: "success" }
 *                 message: { type: string, example: "Notes found successfully!" }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request (e.g., missing search query).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               MissingQuery:
 *                 summary: Missing Search Query
 *                 value:
 *                   status: "fail"
 *                   message: "Search query (q) is required."
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

// All notes endpoints require authentication
router.use(authMiddleware);

router
  .route("/")
  .get(getNotes)
  .post(createNote)
  .put(updateNote)
  .delete(deleteNote);

router.get("/search", searchNotes);

export default router;
