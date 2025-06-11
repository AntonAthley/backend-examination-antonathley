# Swing Notes API

## Overview

This project is the backend API for the "Swing Notes" application, developed as part of a backend examination for Chas Academy.

## Features

- User Authentication: Secure signup and login with JWT (JSON Web Tokens).
- User Management: Ability to delete user accounts.
- Note Management: Create, retrieve, update, and delete personal notes.
- Database Integration: PostgreSQL database for data persistence.
- Error Handling: Centralized error handling for consistent API responses.
- API Documentation: Integrated Swagger UI for interactive API exploration.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL (via `pg` library)
- bcryptjs (for password hashing)
- jsonwebtoken (for JWT authentication)
- Joi (for request body validation)
- dotenv (for environment variable management)
- cors (for Cross-Origin Resource Sharing)
- swagger-ui-express & swagger-jsdoc (for API documentation)

## Installation

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database

### Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/AntonAthley/backend-examination-antonathley.git
    cd backend-examination-antonathley
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory of the project with the following variables:

    ```env
    PORT=5000
    DATABASE_URL="postgresql://user:password@host:port/database_name"
    JWT_SECRET="your_jwt_secret_key"
    JWT_LIFETIME="1h"
    ```

    - `PORT`: The port on which the server will run (e.g., `5000`).
    - `DATABASE_URL`: Your PostgreSQL connection string. Example: `postgresql://user:password@localhost:5432/swingnotes_db`.
    - `JWT_SECRET`: A strong, random string used to sign JWTs. Generate a long, complex string.
    - `JWT_LIFETIME`: The duration for which the JWT will be valid (e.g., `1h`, `7d`).

4.  **Database Setup:**
    Ensure your PostgreSQL database is running and create the necessary tables. I did the following:

    ```sql
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

    CREATE TABLE IF NOT EXISTS notes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        title VARCHAR(50) NOT NULL,
        text VARCHAR(300) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
    CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title);

    CREATE OR REPLACE FUNCTION update_modified_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.modified_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER update_note_modified_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at_column();

    ```

5.  **Run the application:**
    ```bash
    npm start
    ```
    The API will be running at `http://localhost:5000` (or your specified PORT).

## API Endpoints

The API documentation can be accessed via Swagger UI at `http://localhost:5000/api-docs` once the server is running. It provides detailed information on all available endpoints, request/response schemas, and allows you to test the API directly.

Key endpoints include:

- `/api/user/signup` (POST): Register a new user.
- `/api/user/login` (POST): Log in an existing user and get a JWT.
- `/api/user/delete` (DELETE): Delete the authenticated user's account (requires JWT).
- `/api/notes` (POST): Create a new note (requires JWT).
- `/api/notes` (GET): Retrieve all notes for the authenticated user (requires JWT).
- `/api/notes/:id` (GET): Retrieve a specific note by ID for the authenticated user (requires JWT).
- `/api/notes/:id` (PUT): Update a specific note by ID for the authenticated user (requires JWT).
- `/api/notes/:id` (DELETE): Delete a specific note by ID for the authenticated user (requires JWT).
