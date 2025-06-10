import jwt from "jsonwebtoken";

/**
 * Creates a JSON Web Token (JWT) for a given user ID.
 * @param {string} userId - The unique identifier of the user for whom the token is being created.
 * @param {string} secret - The secret key used to sign the token. This secret ensures the token's integrity and authenticity.
 * @param {string} expiresIn - A string indicating the token's expiration time.
 * @param {string} [algorithm="HS256"] - The algorithm used to sign the token.
 * @returns {string} The generated JWT string.
 */
export const createJwtToken = (
  userId,
  secret,
  expiresIn,
  algorithm = "HS256"
) => {
  // Sign the JWT with the user's ID as the payload.
  // The token is signed using the provided secret, configured with an expiration time and algorithm.
  return jwt.sign({ id: userId }, secret, {
    expiresIn: expiresIn,
    algorithm: algorithm,
  });
};
