import { FastifyLoggerOptions } from "fastify";

export function createLoggerConfig(
  env: string,
  level: string
): FastifyLoggerOptions {
  const config: FastifyLoggerOptions = {
    level,
    // Configure request ID generation (used for 'reqId' field)
    genReqId: (req) => {
      return (
        (req.headers["x-request-id"] as string) ||
        `req-${Math.random().toString(36).substring(2, 10)}`
      );
    },
    serializers: {
      req(request) {
        return {
          method: request.method,
          url: request.url,
          path: request.raw.url,
          headers: request.headers,
          body: request.body,
        };
      },
      res(response) {
        return {
          statusCode: response.statusCode,
        };
      },
      err(error) {
        return {
          type: error.name,
          message: error.message,
          stack: error.stack || "",
        };
      },
    },

    ...(env === "local" && {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    }),
  };

  return config;
}
