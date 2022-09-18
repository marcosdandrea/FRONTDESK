const winston = require('winston');
const { username } = require("./backend/services/userServices")

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  timestamp: true,
  defaultMeta: { username },
  transports: [

    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger