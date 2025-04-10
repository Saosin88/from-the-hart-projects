import fastify, { FastifyInstance } from "fastify";
import { registerSwagger } from "./config/swagger";

import { fastifyLogger } from "./config/logger";
import projectRoutes from "./routes/projects";

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: fastifyLogger,
  });

  registerSwagger(app);

  app.register(projectRoutes, { prefix: "/projects" });

  return app;
}
