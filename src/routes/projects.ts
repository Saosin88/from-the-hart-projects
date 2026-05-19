import { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as projectController from "../controllers/projectsController";
import { RepositorySchema } from "../models/Repository";
import { Type } from "@sinclair/typebox";

const UsernameParamSchema = Type.Object({
  username: Type.String({
    description: "GitHub username to fetch repositories for",
    minLength: 1,
  }),
});

const projectRoutes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get("/health", {
    schema: {
      description: "Health check endpoint to verify the service is running.",
      summary: "Service health check",
      response: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      status: { type: "string", description: "Service status" },
                      uptime: {
                        type: "number",
                        description: "Service uptime in seconds",
                      },
                      timestamp: {
                        type: "number",
                        description:
                          "Current server timestamp (ms since epoch)",
                      },
                    },
                    required: ["status", "uptime", "timestamp"],
                  },
                },
                required: ["data"],
              },
              examples: {
                HealthCheckSuccess: {
                  summary: "Healthy response",
                  value: {
                    data: {
                      status: "ok",
                      uptime: 123.45,
                      timestamp: 1716123456789,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    handler: projectController.checkHealth,
  });

  fastify.get("/github/:username", {
    schema: {
      description: "Get public GitHub repositories for a given username.",
      summary: "List GitHub repositories by username",
      params: UsernameParamSchema,
      response: {
        200: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: RepositorySchema,
              description: "List of GitHub repositories for the user",
            },
          },
          required: ["data"],
          example: {
            data: [
              {
                id: 123456,
                name: "from-the-hart-projects",
                description:
                  "A showcase of From The Hart's open source projects.",
                html_url:
                  "https://github.com/fromthehart/from-the-hart-projects",
                stargazers_count: 42,
                language: "TypeScript",
                updated_at: "2025-05-20T12:34:56Z",
              },
              {
                id: 654321,
                name: "from-the-hart-infrastructure",
                description: "Terraform infrastructure for From The Hart.",
                html_url:
                  "https://github.com/fromthehart/from-the-hart-infrastructure",
                stargazers_count: 15,
                language: "HCL",
                updated_at: "2025-05-18T09:12:34Z",
              },
            ],
          },
        },
      },
    },
    handler: projectController.getRepositoriesByUsername,
  });
};

export default projectRoutes;
