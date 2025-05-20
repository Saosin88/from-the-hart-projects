import { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import path from "path";
import fs from "fs";

export function registerSwagger(app: FastifyInstance): void {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "From The Hart Projects API",
        version: "1.0.0",
        description:
          "API for managing and displaying projects in the From The Hart ecosystem.",
      },
      servers: [
        { url: "http://localhost:8080", description: "Local server" },
        // Add your production server here if needed
      ],
    },
  });

  const logoPath = path.join(
    __dirname,
    "..",
    "public",
    "images",
    "from-the-hart.svg"
  );
  const logoContent = fs.readFileSync(logoPath);

  app.register(fastifySwaggerUi, {
    routePrefix: "/projects/documentation",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    logo: {
      type: "image/svg+xml",
      content: Buffer.from(logoContent),
      href: "https://www.fromthehart.tech",
      target: "_blank",
    },
  });
}
