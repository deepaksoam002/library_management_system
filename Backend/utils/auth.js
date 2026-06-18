const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config')

async function handlePasswordHashing (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
};

async function handlePasswordComparison(password, hashed_Password){
   try { 
    const isPasswordValid = await bcrypt.compare(password, hashed_Password)
    if(isPasswordValid){
        return true;
    }
    else {
        return false;
    }
   } catch (error) {
    
    console.error("internal error during password comparison : error");
    throw new Error("An error occurred while while verifying credentials. ");
   }
    

}

async function generateAccessToken(user){

    const payload = {
        id : user.id,
        email : user.email,
        role : user.role
    };

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : 'strict',
    }

    try{
        const accessToken = await jwt.sign(payload,config.jwt.secret, config.jwt.expiresIn, options)
        return accessToken;
    }catch(error){
        throw new Error('Error occurred while generating access token!!');
    }
}

async function generateRefreshToken(user){
    const payload = {
        id : user.id,
        role : user.role
    };

    const options ={
        httpOnly : true,
        secure : true,
        sameSite : 'strict',
        expriresIn : '30d',
    }

    try{
    const refreshToken = await jwt.sign(payload,config.jwt.refreshSecret, options);
    return refreshToken;
    } catch(error){
        throw new Error('Error occurred while generating refresh token!!');
    }
}

async function verifyAccessToken(accessToken){
    try{

        const decoded = await jwt.verify(accessToken, config.jwt.secret);
        return decoded;
    }catch(error){
        if(error.name === 'TokenExpiredError'){
            throw new Error('Access token has expired!! Check for refresh token!!');
        } else if(error.name === 'JsonWebTokenError'){
            throw new Error('Invalid access token!! Please login again!!');
        } else {
            throw new Error('Error occurred while verifying access token!!');
        }

        return null;
    }
}

async function verifyRefreshToken(refreshToken){
    try{
             const refreshTokenDecoded = await jwt.verify(refreshToken, config.jwt.refreshSecret);
             return refreshTokenDecoded;
    } catch(error){
        if(error.name === 'TokenExpiredError'){
            throw new Error('Refresh token has expired!! Please login again!!');
        } else if(error.name === 'JsonWebTokenError'){
            throw new Error('Invalid refresh token!! Please login again!!');
        } else {
            throw new Error('Error occurred while verifying refresh token!!');
        }
        return null;
    }
}


module.exports = {
    handlePasswordHashing,
    handlePasswordComparison,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}