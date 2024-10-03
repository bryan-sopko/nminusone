const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',  // Default logging level
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),  // To log stack trace
        winston.format.splat(),
        winston.format.json()
    ),
    transports: [
        // Console transport
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // File transport
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
// Existing imports and logger setup

// Function to handle Axios errors
function logAxiosError(error) {
    if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        logger.error('Axios Error - Response Error: %s, Status: %d, Headers: %o, Data: %o', 
            error.message, 
            error.response.status, 
            error.response.headers, 
            error.response.data
        );
    } else if (error.request) {
        // The request was made but no response was received
        logger.error('Axios Error - Request Made, No Response: %s, Request: %o', 
            error.message, 
            error.request
        );
    } else {
        // Something happened in setting up the request that triggered an Error
        logger.error('Axios Error - Setup Error: %s', error.message);
    }

    // Log error stack if available
    if (error.stack) {
        logger.error('Axios Error - Stack: %s', error.stack);
    }
}

module.exports = {
    logger,
    logAxiosError
};

