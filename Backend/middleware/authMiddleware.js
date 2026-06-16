const bcrypt = require('bcrypt');

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


module.exports = {
    handlePasswordHashing,
    handlePasswordComparison
}