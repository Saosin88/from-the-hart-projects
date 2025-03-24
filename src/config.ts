export default {
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
    host: process.env.HOST || "0.0.0.0",
  },
  logger: {
    level: process.env.LOG_LEVEL || "info",
  },
};
