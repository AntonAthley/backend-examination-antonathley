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
 *         description: Bad request (e.g., missing fields, invalid format).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               InvalidUsername:
 *                 summary: Invalid Username Format
 *                 value:
 *                   status: "fail"
 *                   message: "Username must be at least 3 characters long."
 *               InvalidPassword:
 *                 summary: Invalid Password Format
 *                 value:
 *                   status: "fail"
 *                   message: "Password must be at least 6 characters long."
 *               MissingCredentials:
 *                 summary: Missing Username/Password
 *                 value:
 *                   status: "fail"
 *                   message: "Username and password are required."
 *       409:
 *         description: Conflict (e.g., username already exists).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               UsernameExists:
 *                 summary: Username Already Exists
 *                 value:
 *                   status: "fail"
 *                   message: "Username already exists."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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
 *         description: Bad request (e.g., missing fields).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               MissingCredentials:
 *                 summary: Missing Username/Password
 *                 value:
 *                   status: "fail"
 *                   message: "Username and password are required."
 *       401:
 *         description: Unauthorized (e.g., invalid credentials).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               InvalidCredentials:
 *                 summary: Invalid Username or Password
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid credentials."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               NoToken:
 *                 summary: Missing Token
 *                 value:
 *                   status: "fail"
 *                   message: "You are not logged in! Please log in to get access."
 *               InvalidToken:
 *                 summary: Invalid Token
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid token. Please log in again."
 *               ExpiredToken:
 *                 summary: Expired Token
 *                 value:
 *                   status: "fail"
 *                   message: "Your token has expired! Please log in again."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               UserNotFound:
 *                 summary: User Not Found
 *                 value:
 *                   status: "fail"
 *                   message: "User not found or could not be deleted."
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/delete", authMiddleware, deleteCurrentUser);

export default router;
