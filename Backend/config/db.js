// const {Pool} = require('@neondatabase/serverless');
const {Pool} = require('pg');   // Uncomment if using postgresql locally
const config = require('./config');


// const pool = new Pool({
//   connectionString : config.db.db_url,
  
// });




// we are using neon postgresql database, so we will use the connection string from the environment variable DATABASE_URL

const pool = new Pool({
    user     : config.db.db_user,
    host     : config.db.db_host,
    database : config.db.db_name,
    password : config.db.db_pass,
    port     : config.db.db_port || 5432,
});


pool.on('connect',() => {
    console.log('Connected to the Database successfully!');
})

pool.on('error',(err) => {
    console.error('Database connection error :', err);
    process.exit(-1);
})


module.exports = {
  query:(text,params) => pool.query(text,params),
};