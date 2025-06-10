import swaggerJsdoc from "swagger-jsdoc";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Helper to get __dirname in ES Modules context.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swing Notes API",
      version: "1.0.0",
      description:
        "API for managing personal notes, with user authentication and search functionality.",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT Authorization header using the Bearer scheme. Example: 'Authorization: Bearer {token}'",
        },
      },
      schemas: {
        // Define a central ErrorResponse schema for consistent error representation.
        ErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Status of the operation (e.g., 'fail', 'error').",
              example: "fail",
            },
            message: {
              type: "string",
              description: "Descriptive error message.",
              example:
                "Validation failed: Username must be at least 3 characters long.",
            },
          },
        },
      },
      // Define common API responses that can be reused across different endpoints.
      responses: {
        BadRequest: {
          description: "Bad request (e.g., missing fields, invalid format).",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        Conflict: {
          description: "Conflict (e.g., username already exists).",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        Unauthorized: {
          description: "Unauthorized (missing or invalid token).",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        Forbidden: {
          description: "Forbidden (user does not own the resource).",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        NotFound: {
          description: "Not found (resource not found).",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  // Specify API files to include for JSDoc-based Swagger documentation.
  apis: [
    join(__dirname, "../routes/*.js"), // Include all route files.
    join(__dirname, "../controllers/*.js"), // Include all controller files.
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
