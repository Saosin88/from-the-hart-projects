import { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as projectController from "../controllers/projectController";
import {
  ProjectSchema,
  ProjectInputSchema,
  ProjectUpdateSchema,
  IdParamSchema,
} from "../models/Project";

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
  fastify.get("/", {
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            data: { type: "array", items: ProjectSchema },
          },
        },
      },
    },
    handler: projectController.getProjects,
  });

  fastify.get("/:id", {
    schema: {
      params: IdParamSchema,
      response: {
        200: {
          type: "object",
          properties: {
            data: ProjectSchema,
          },
        },
      },
    },
    handler: projectController.getProjectById,
  });

  fastify.post("/", {
    schema: {
      body: ProjectInputSchema,
      response: {
        201: {
          type: "object",
          properties: {
            data: ProjectSchema,
          },
        },
      },
    },
    handler: projectController.addProject,
  });

  fastify.put("/:id", {
    schema: {
      params: IdParamSchema,
      body: ProjectUpdateSchema,
      response: {
        200: {
          type: "object",
          properties: {
            data: ProjectSchema,
          },
        },
      },
    },
    handler: projectController.updateProject,
  });

  fastify.delete("/:id", {
    schema: {
      params: IdParamSchema,
      response: {
        204: {
          type: "null",
          description: "Project successfully deleted",
        },
      },
    },
    handler: projectController.deleteProject,
  });
};

export default projectRoutes;
