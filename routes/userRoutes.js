import { Router } from "express";
import {
  signup,
  login,
  deleteCurrentUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User authentication and registration
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user account
 *     tags: [User]
 *     description: Allows a new user to create an account by providing a username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// Route for user signup. When a POST request is made to /user/signup,
// the `signup` function from `userController.js` is executed to handle the registration logic.
router.post("/signup", signup);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in to an existing user account
 *     tags: [User]
 *     description: Authenticates a user and returns a JWT for subsequent API requests.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// Route for user login. When a POST request is made to /user/login,
// the `login` function from `userController.js` is executed to handle the authentication logic.
router.post("/login", login);

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Delete the authenticated user's account
 *     tags: [User]
 *     description: Permanently deletes the account of the authenticated user and all associated notes.
 *     security:
 *       - bearerAuth: [] # This endpoint requires JWT authentication
 *     responses:
 *       204:
 *         description: User account successfully deleted. No content.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// Route for deleting the current user's account. When a DELETE request is made to /user/delete,
// `authMiddleware` is first executed to verify the JWT, and if successful,
// `deleteCurrentUser` from `userController.js` handles the account deletion.
router.delete("/delete", authMiddleware, deleteCurrentUser);

export default router;
