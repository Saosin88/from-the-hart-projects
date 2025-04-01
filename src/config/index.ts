import { createLoggerConfig } from "./logger";

const logLevel = process.env.LOG_LEVEL || "debug";
const env = process.env.NODE_ENV || "local";

export default {
  env,
  logLevel,
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
    host: process.env.HOST || "0.0.0.0",
  },
  logger: createLoggerConfig(env, logLevel),
};
