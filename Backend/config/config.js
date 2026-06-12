const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');


const schema = Joi.object().
keys({
    NODE_ENV : Joi.string().valid('production','devlopment','test').required(),
    PORT : Joi.number().default(5000),
    DB_USER :  Joi.string().required().description("PostgreSQL username!!"),
    DB_PASSWORD : Joi.string().required().description("Postgre password"),
    DB_HOST : Joi.string().required().description('PostgreSQL Host Name'),
    DB_NAME : Joi.string().required().description('PostgreSQL name'),
    DB_PORT : Joi.number().default(5432),
    JWT_SECRET : Joi.string().required().description('JWT Secret Key')
}).unknown();

const {value : envVars, error} = schema.prefs({error : { lable : key}}).validate(process.env)

if(error){
    throw new Error(`Config Validation Error : $(error.message)`)
};

module.exports = {
    env : envVars.NODE_ENV,
    port : envVars.PORT,
    db : {
        db_user : envVars.DB_USER,
        db_pass : envVars.DB_PASSWORD,
        db_host : envVars.DB_HOST,
        db_name: envVars.DB_NAME,
        db_port : envVars.DB_PORT
    },
    jwt : {
       secret : envVars.JWT_SECRET

    }
}