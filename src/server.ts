import { buildApp } from "./app";
import config from "./config";

const app = buildApp();

const start = async () => {
  try {
    await app.listen({
      port: config.server.port,
      host: config.server.host,
    });
    app.log.info(
      `Server listening on ${config.server.host}:${config.server.port}`
    );
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
