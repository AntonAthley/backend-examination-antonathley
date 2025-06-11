import swaggerJsdoc from "swagger-jsdoc";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

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
      securityScheemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT Authorization header using the Bearer scheme. Example: 'Authorization: Bearer {token}'",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Status of the operation (e.g., 'fail', 'error').",
            },
            message: {
              type: "string",
              description: "Descriptive error message.",
            },
          },
          example: {
            status: "fail",
            message: "An error occurred.",
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Bad request (e.g., missing fields, invalid format).",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                status: "fail",
                message: "Title cannot be empty, text cannot be empty.",
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
              example: {
                status: "fail",
                message: "Username already exists.",
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
              example: {
                status: "fail",
                message: "You are not logged in! Please log in to get access.",
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
              example: {
                status: "fail",
                message: "You do not have permission to access this resource.",
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
              example: {
                status: "fail",
                message:
                  "Note not found or you do not have permission to access it.",
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
              example: {
                status: "error",
                message: "Something went wrong on the server.",
              },
            },
          },
        },
      },
    },
  },
  apis: [
    join(__dirname, "../routes/*.js"),
    join(__dirname, "../controllers/*.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
