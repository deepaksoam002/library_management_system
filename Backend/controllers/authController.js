const sql = require('../config/db');
const {saveRefreshToken,saveVerificationData, validateOTPData} = require('../localDatabase/database');
const sendEmail = require('../utils/mail')
const cookies = require('cookie-parser');
const { handlePasswordHashing,
        handlePasswordComparison, 
        generateAccessToken,
        generateRefreshToken,
        getOtp} = require('../utils/auth');
const { json } = require('stream/consumers');


// Handle new user registration ---
async function handleNewUserRegistration(req, res){

    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        return res.status(400).json ({message: 'All input filelds are required!!'})
    }
    // we can add another check on password 
    try{
        const isUserExist = await sql.query('SELECT * FROM users WHERE email = $1', [email]);

        if(isUserExist.rows.length > 0){
          return res.status(409).json({message: 'User already exists!! Please login!!'})
        }
        
        const otp = getOtp();
        saveVerificationData(username, email, password, otp);
        // genrate otp for user and send email 
        const emailData = {
            to: email,
            emailType: 'emailVerification',
            otp: otp,
            name: username,
        }
         const isEmailSend = sendEmail(emailData);

         if (!isEmailSend){ 
            throw new Error('Unable to send verification email');
         };

       console.log('otp send on email to client', otp);
       return res.status(201).json({message: 'OTP send  successfully!!'});

    }
    catch(error){

        console.error('Error occurred while registering new user:', error);
        return res.status(500).json({message: 'Internal server error!!'})

 
    }
};

//Handle email verification --- Status : pending
async function handleEmailVerification(req, res){
   
    const {email, otp} = req.body;

    if(!email || !otp) {
        throw new Error({message : "all fields are require to filled!!"})
        return res.status(400).json({message: "All fields are require to filled!!" });
    };

    // if we have both values then we check our tempUserData.json file to validate otp 
    try{

    const userObject = await validateOTPData(email, otp);

    if(!userObject){
        throw new Error({message:"Otp Invalid !! Please enter correct OTP"});
        return res.status(400).json({message:"Otp Invalid !! Please enter correct OTP"})
    }

    // console.log(`Otp Validated Successfully!! ${userObject.password}`)

    //   const password
       // Hash the password before storing it in the database  status : pending
        const hashedPassword = await handlePasswordHashing(userObject.password);
        const result = await sql.query('INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4 ) RETURNING *', [userObject.name, userObject.email, hashedPassword, 'student']
        );
        const data = result.rows[0];
        const userData = {
            id :data.id,
            email : data.email,
            role: data.role,
        }
        //  refresh token and access token creation 
         const accessToken = await generateAccessToken(userData);
         const refreshToken = await generateRefreshToken(userData);

        // console.log(`accessToken : ${accessToken} and refreshToken : ${refreshToken}`);

         // save refresh token in database.json file

         await saveRefreshToken(userData.id, refreshToken);

         //send accesstoken and refresh token in response

         res.cookie('uuid7d', accessToken, {
            httpOnly : true,
            secure : true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
         });

         res.cookie('uuid30d', refreshToken, {
            httpOnly : true,
            secure : true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
         });
         
        //  res.send("Cookie Set")
         return res.status(201).json({ message: "New User create Successfully"})


        }catch{
            console.log("Internal Server Error!!")
            return res.status(500).json({ message: "Internal Server Error!!"})
        }


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
