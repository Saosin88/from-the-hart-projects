import fastify, { FastifyInstance } from "fastify";
import { registerSwagger } from "./config/swagger";

import { fastifyLogger } from "./config/logger";
import projectRoutes from "./routes/projects";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: fastifyLogger,
  });

  app.withTypeProvider<TypeBoxTypeProvider>();

  registerSwagger(app);

  app.register(projectRoutes, { prefix: "/projects" });

  return app;
}
