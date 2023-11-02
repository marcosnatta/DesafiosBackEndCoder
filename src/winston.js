import winston from "winston";
import config from "./config.js";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "black",
    warning: "yellow",
    info: "blue",
    http: "white",
    debug: "green",
  },
};

export let logger;

if (config.environment === "production") {
  logger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.prettyPrint()
    ),
    transports: [
      new winston.transports.Console({ levels: "info" }),
      new winston.transports.File({
        filename: "./errors.log",
        levels: "error",
      }),
    ],
  });
} else {
  logger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevels.colors }),
          winston.format.simple()
        ),
      }),
    ],
  });
}

export default logger;
