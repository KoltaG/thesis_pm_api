import { SwaggerDefinition } from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Thesis PM Tool API",
    version: "1.0.0",
    description: "This is the API for the Thesis PM Tool",
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
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "60d0fe4f5311236168a109ca",
          },
          name: {
            type: "string",
            example: "John Doe",
          },
          email: {
            type: "string",
            example: "john.doe@example.com",
          },
          role: {
            type: "string",
            enum: ["PM", "Dev"],
            example: "PM",
          },
          date: {
            type: "string",
            format: "date-time",
            example: "2023-07-19T16:47:30.507Z",
          },
        },
      },
      Project: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "60d0fe4f5311236168a109ca",
          },
          name: {
            type: "string",
            example: "New Project",
          },
          assignedUserIds: {
            type: "array",
            items: {
              type: "string",
              example: "60d0fe4f5311236168a109ca",
            },
          },
        },
      },
      Task: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "60d0fe4f5311236168a109ca",
          },
          name: {
            type: "string",
            example: "New Task",
          },
          description: {
            type: "string",
            example: "Task description",
          },
          projectId: {
            type: "string",
            example: "60d0fe4f5311236168a109ca",
          },
          assignedUserId: {
            type: "string",
            example: "60d0fe4f5311236168a109ca",
          },
          status: {
            type: "string",
            enum: ["To Do", "In Progress", "Done"],
            example: "To Do",
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const swaggerOptions: Options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

export default swaggerOptions;
