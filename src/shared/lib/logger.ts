import { app } from "electron";
import winston from "winston";

// Configurar el logger
const logger = winston.createLogger({
  level: "debug",
  format: winston.format.simple(),
  transports: [new winston.transports.File({ dirname: app.getPath("crashDumps") }), new winston.transports.Console()],
});

// Capturar eventos de uncaughtException
process.on("uncaughtException", (error) => {
  logger.error(`Error not captured: ${error.stack}`);
  // Puedes realizar acciones adicionales en caso de uncaughtException, como cerrar la aplicación, guardar datos, etc.
});

// Capturar eventos de unhandledRejection
process.on("unhandledRejection", (reason: any) => {
  logger.error(`Rejection not captured: ${reason.stack || reason}`);
  // Puedes realizar acciones adicionales en caso de unhandledRejection, como cerrar la aplicación, guardar datos, etc.
});

// Resto del código de tu aplicación Electron
export default logger;
