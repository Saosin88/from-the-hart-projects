import fastify, { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import config from "./config";
import projectRoutes from "./routes/projects";

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: config.logger,
  });

  // Setup Swagger
  app.register(fastifySwagger, {
    swagger: {
      info: {
        title: "From The Hart Projects API",
        description: "API for managing projects",
        version: "1.0.0",
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info here",
      },
      schemes: ["http", "https"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/projects/documentation",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    staticCSP: true,
  });

  app.register(projectRoutes, { prefix: "/projects" });

  app.get("/", async () => {
    return { status: "ok", message: "From The Hart Projects API" };
  });

  return app;
}
