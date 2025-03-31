import fastify, { FastifyInstance } from "fastify";
import { registerSwagger } from "./config/swagger";

import config from "./config";
import projectRoutes from "./routes/projects";

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: config.logger,
  });

  registerSwagger(app);

  app.register(projectRoutes, { prefix: "/projects" });

  app.get("/", async () => {
    return { status: "ok", message: "From The Hart Projects API" };
  });

  return app;
}
