const morgan = require('morgan');
const logger = require('./logger');
const config = require('./config');

// create custom morgan token message and assign value from res.locals.errorMessage which we save here in middleware code file
morgan.token('message',(req, res) => res.locals.errorMessage || '')

// get userIpAddrss if code run in production
const getIpFormat = () => {config.env === 'production' ? ':remote-addr -' : ''};

// create log format for both successhandler and errorhandler
const successResponseFormat = `${getIpFormat()} :method :url :status - :response-time ms `;
const errorResponseFormat =`${getIpFormat} :method :url :status - :response-time ms`;

// successHandler function that skip all log which status 400 or greater then 400
const successHandler = morgan( successResponseFormat,{
    skip : (req, res)=> res.statusCode >= 400,
    stream : { write : (message) => logger.info(message.trim()) },

});

// successHandler function that skip all log which status  less then 400

const errorHandler = morgan(errorResponseFormat, {
    skip : (req, res)=> res.statusCode < 400,
    stream : { write : (message)=> logger.error(message.trim())},
});


module.exports = {
    successHandler,
    errorHandler,
};