const sql = require('../config/db');
const { handlePasswordHashing } = require('../middleware/authMiddleware');


async function handleNewUserRegistration(req, res){

    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        return res.status(400).json ({message: 'All input filelds are required!!'})
    }

    try{
        const isUserExist = await sql.query('SELECT * FROM users WHERE email = $1', [email]);

        if(isUserExist.rows.length > 0){
          return res.status(409).json({message: 'User already exists!! Please login!!'})
        }
 
       // Hash the password before storing it in the database  status : pending
        const hashedPassword = await handlePasswordHashing(password);
        const result = await sql.query('INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4 ) RETURNING *', [username, email, hashedPassword, 'student']
        );

       console.log('New user registered successfully!!', result.rows[0]);
       return res.status(201).json({message: 'New User registered successfully!!', userId: result.rows[0].id});

    }
    catch(error){

        console.error('Error occurred while registering new user:', error);
        return res.status(500).json({message: 'Internal server error!!'})

 
    }
};

module.exports = {
    handleNewUserRegistration,
}
