const winston = require('winston');
const config = require('./config');
const { object } = require('joi');


//  here we get only message for new Error  we get whole info about the error from .stack property

const enumarateErrorFormat = winston.format((info) => {

    if(info instanceof Error){
        object.assign(info,{message : info.stack});
    }
    return info
});

const logger = winston.createLogger({
    level : config.env === 'development' ? 'debug':'info',
    format : winston.format.combine(
        enumarateErrorFormat(),
        config.env === 'development'? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({level, message}) => `${level} : ${message}`)
    ),

   transports : [
         new winston.transports.Console({
            stderrLevels : ['error']
         }),
   ],

});


module.exports = logger;