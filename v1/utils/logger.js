const { createLogger, format, transports } = require("winston");
const { combine, timestamp, json, colorize } = format;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${level} - ${message}`;
  })
);

// Create a Winston logger
const logger = createLogger({
  level: "info",
  defaultMeta: {
    env: process.env.NODE_ENV,
    app: "boyler_estate_app",
  },
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.File({ filename: "app.log" }),
    new transports.Console({
      format: consoleLogFormat,
    }),
  ],
});

module.exports = logger;
