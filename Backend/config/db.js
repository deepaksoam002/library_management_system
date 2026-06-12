const {Pool} = require('pg');
const config = require('./config');


const pool = new Pool({
    user     : db_user,
    host     : db_host,
    database : db_name,
    password : db_pass,
    port     : db_port || 5432,
});


module.exports = {
  query:(text,params) => pool.query(text,params),
};