import { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as projectController from "../controllers/projectsController";
import { GitHubProjectSchema, UsernameParamSchema } from "../models/Projects";

const projectRoutes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get("/health", {
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                status: { type: "string" },
                uptime: { type: "number" },
                timestamp: { type: "number" },
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
      params: UsernameParamSchema,
      response: {
        200: {
          type: "object",
          properties: {
            data: { type: "array", items: GitHubProjectSchema },
          },
        },
      },
    },
    handler: projectController.getGitHubProjectsByUsername,
  });
};

export default projectRoutes;
