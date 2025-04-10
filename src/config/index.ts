const logLevel = process.env.LOG_LEVEL || "debug";
const env = process.env.NODE_ENV || "local";

const server = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
  host: process.env.HOST || "0.0.0.0",
};

export const config = {
  env,
  logLevel,
  server,
};
