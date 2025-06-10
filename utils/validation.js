import Joi from "joi";
import { AppError } from "./appError.js";

/**
 * Joi schema for validating user signup requests.
 * Defines rules for 'username' (min 3, max 50 characters, required)
 * and 'password' (min 6 characters, required).
 */
export const signupSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username cannot exceed 50 characters.",
    "string.empty": "Username cannot be empty.",
    "any.required": "Username is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required.",
  }),
});

/**
 * Joi schema for validating user login requests.
 * Defines rules for 'username' (required) and 'password' (required).
 */
export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username cannot be empty.",
    "any.required": "Username is required.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required.",
  }),
});

/**
 * Joi schema for validating the creation of a new note.
 * Defines rules for 'title' (min 1, max 50 characters, required)
 * and 'text' (min 1, max 300 characters, required).
 */
export const createNoteSchema = Joi.object({
  title: Joi.string().min(1).max(50).required().messages({
    "string.min": "Title must be at least 1 character long.",
    "string.max": "Title cannot exceed 50 characters.",
    "string.empty": "Title cannot be empty.",
    "any.required": "Title is required.",
  }),
  text: Joi.string().min(1).max(300).required().messages({
    "string.min": "Text must be at least 1 character long.",
    "string.max": "Text cannot exceed 300 characters.",
    "string.empty": "Text cannot be empty.",
    "any.required": "Text is required.",
  }),
});

/**
 * Joi schema for validating updates to an existing note.
 * Defines optional rules for 'title' (min 1, max 50 characters)
 * and 'text' (min 1, max 300 characters).
 * At least one field must be present for the update to be valid (`.min(1)`).
 */
export const updateNoteSchema = Joi.object({
  title: Joi.string().min(1).max(50).messages({
    "string.min": "Title must be at least 1 character long.",
    "string.max": "Title cannot exceed 50 characters.",
  }),
  text: Joi.string().min(1).max(300).messages({
    "string.min": "Text must be at least 1 character long.",
    "string.max": "Text cannot exceed 300 characters.",
  }),
}).min(1); // Ensures that at least one field (title or text) is provided for update.

/**
 * A utility function to validate data against a given Joi schema.
 * If validation fails, it collects all error messages and throws an AppError.
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @param {object} data - The data object to be validated.
 * @returns {object} The validated data, with any Joi defaults or transformations applied.
 * @throws {AppError} If validation fails, with a concatenated message of all validation errors.
 */
export const validate = (schema, data) => {
  // Validate the data against the provided schema. `abortEarly: false` ensures all errors are collected.
  const { error, value } = schema.validate(data, { abortEarly: false });
  // If validation errors exist, process them.
  if (error) {
    // Map Joi's error details to an array of messages.
    const errorMessages = error.details.map((detail) => detail.message);
    // Throw a custom AppError with a concatenated string of all error messages and a 400 status.
    throw new AppError(errorMessages.join(", "), 400);
  }
  // If validation is successful, return the validated value.
  return value;
};
