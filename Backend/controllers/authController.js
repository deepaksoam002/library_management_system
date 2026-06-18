const sql = require('../config/db');
const { handlePasswordHashing,
        handlePasswordComparison } = require('../utils/auth');

// Handle new user registration ---
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

//Handle email verification --- Status : pending
async function handleEmailVerification(req, res){

}



//Handle email verification token Validation --- Status : pending
async function handleEmailVerificationTokenValidation(req, res){

}



// Handle new user signup with Google --- Status : pending
async function handleGoogleSignup(req, res){

}



// Handle user login --- Status : pending
async function handleUserLogin(req, res){
    const {email, password} = req.body;

    // Validate input fields
    if(!email || !password)
    return res.status(400).json({message: 'All input fields are required!!'})
   
     try{
         const userResult = await sql.query('SELECT * FROM users WHERE email = $1', [email]);

          if(userResult.rows.length === 0){
             return res.status(404).json({message: 'User not found!! Please sign up!!'});
          }
     
    const user = userResult.rows[0];
    const hash_Password = user.hash_Password    // gethash password from databse

    const isPasswordValid = await handlePasswordComparison(password, hash_Password);
    if (!isPasswordValid){
        return res.status(401).json({message: 'Invalid credentials!! Please try again!!'})
    }
    
    // Generate JWT token and send response --- Status : pending
    console.log('User logged in successfully!!', user);
    return res.status(200).json({message: 'User logged in successfully!!', userId: user.id});

}
catch(error){
    console.error('Error occurred while Logging in user:', error);
    return res.status(500).json({message: 'Internal server error!!'});
}
}



// Handle user logout --- Status : pending
async function handleUserLogout(req, res){

}



// Handle forgot password requst--- Status : pending
async function handleForgotPassword(req, res){

}



// Handle Reset password request --- Status : pending
async function handleResetPassword(req, res){
    
}



module.exports = {
    handleNewUserRegistration,
    handleEmailVerification,
    handleEmailVerificationTokenValidation,
    handleGoogleSignup,
    handleUserLogin,
    handleUserLogout,
    handleForgotPassword,
    handleResetPassword
}
