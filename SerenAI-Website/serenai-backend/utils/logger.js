// serenai-backend/utils/logger.js
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const LOG_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatLog = (level, message, data = null) => {
  const timestamp = getTimestamp();
  let log = `[${timestamp}] [${level}] ${message}`;
  
  if (data) {
    log += ` | ${JSON.stringify(data)}`;
  }
  
  return log;
};

const writeToFile = (log) => {
  const logFile = path.join(logDir, `serenai-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, log + '\n');
};

module.exports = {
  info: (message, data) => {
    const log = formatLog(LOG_LEVELS.INFO, message, data);
    console.log(log);
    writeToFile(log);
  },
  
  warning: (message, data) => {
    const log = formatLog(LOG_LEVELS.WARNING, message, data);
    console.warn(log);
    writeToFile(log);
  },
  
  error: (message, data) => {
    const log = formatLog(LOG_LEVELS.ERROR, message, data);
    console.error(log);
    writeToFile(log);
  },
  
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      const log = formatLog(LOG_LEVELS.DEBUG, message, data);
      console.log(log);
      writeToFile(log);
    }
  }
};
