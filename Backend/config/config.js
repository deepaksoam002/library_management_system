const dotenv = require('dotenv');  // this line only loads the environment variables from the .env file into process.env
dotenv.config() // this line loads the environment variables from the .env file into process.env
const path = require('path');
const Joi = require('joi');


const schema = Joi.object().
keys({
    NODE_ENV : Joi.string().valid('production','development','test').required(),
    PORT : Joi.number().default(5000),
    DB_USER :  Joi.string().description("PostgreSQL username!!"),
    DB_PASSWORD : Joi.string().description("Postgre password"),
    DB_HOST : Joi.string().description('PostgreSQL Host Name'),
    DB_NAME : Joi.string().description('PostgreSQL name'),
    DB_PORT : Joi.number().default(5432),
    DB_URL : Joi.string().description('PostgreSQL connection string'), // required  if using neon database
    JWT_SECRET : Joi.string().required().description('JWT Secret Key'),
    JWT_EXPIRESIN : Joi.string().required().description('JWT Expiration Time'),
    JWT_REFRESH_SECRET : Joi.string().required().description('JWT Refresh Secret Key'),
    GMAIL_USER : Joi.string().required().description('Gmail user email address'),
    GMAIL_PASS: Joi.string().required().description('Gmail user password'),
    GOOGLE_CLIENTID: Joi.string().required().description('Google auth id'),
    GOOGLE_PASS : Joi.string().required().description('Google auth password'),
    GOOGLE_CLIENT_SECRET : Joi.string().required().description('Google client secret'),
   
}).xor('DB_URL','DB_USER')
.and('DB_USER','DB_PASSWORD','DB_HOST','DB_NAME').without('DB_URL',['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_NAME']).unknown();




const {value : envVars, error} = schema.prefs({errors : { label : 'key'}}).validate(process.env)

if(error){
    throw new Error(`Config validation error : ${error.message}`)
};

module.exports = {
    env : envVars.NODE_ENV,
    port : envVars.PORT,
    db : {
        db_url : envVars.DB_URL,
        db_user : envVars.DB_USER,
        db_pass : envVars.DB_PASSWORD,
        db_host : envVars.DB_HOST,
        db_name: envVars.DB_NAME,
        db_port : envVars.DB_PORT
    },
    jwt : {
       secret : envVars.JWT_SECRET,
       refreshSecret : envVars.JWT_REFRESH_SECRET,
       expiresIn : envVars.JWT_EXPIRESIN,

    },
    email : {
        user : envVars.GMAIL_USER,
        pass : envVars.GMAIL_PASS
    },
    googleauth : {
        client : envVars.GOOGLE_CLIENTID,
        pass : envVars.GOOGLE_PASS,
        secret : envVars.GOOGLE_CLIENT_SECRET
    }
}