const path = require('path');
const fs = require('fs/promises');



async function saveRefreshToken(id, token){

    let tokenData = {};

    // first we get data from file then parsh in JSON then save to token if data exist  and we can add new entry and save back 
    const filePath = path.join(__dirname, 'database.json');
      console.log(filePath);
    try{
    const fileData = await fs.readFile(filePath,'utf-8')

    // parsh in json 
    tokenData = JSON.parse(fileData);

    }catch(err){
        throw new Error(`unable to read database.json file,${err}`)
    }

    // Add new data in token 
    tokenData[id] = {
        refreshToken : token,
        updatedAt: new Date().toISOString()
    }
    
   // add json data back to file 

   try{

      await fs.writeFile(filePath, JSON.stringify(tokenData, null, 2), 'utf-8')

      console.log('refresh token save successfully in file')

   }catch(err){

    if(err.code = 'ENOENT'){
        console.log('file not found new file creating')

        await fs.writeFile(filePath, {}, 'utf-8')
    }else {

        console.log('something else wrong in refresh token saving ')
    }
   }

}

async function saveVerificationData(name, email, pass, otp){

    let usersData = {};

    // first we get data from file then parsh in JSON then save to token if data exist  and we can add new entry and save back 
    const filePath = path.join(__dirname, 'tempUserData.json');
      console.log(filePath);
    try{
    const fileData = await fs.readFile(filePath,'utf-8')

    // parsh in json 
    usersData = JSON.parse(fileData);

    }catch(err){
        throw new Error(`unable to read database.json file,${err}`)
    }
    // first remove if there already a object live so we only store latest data 

    


    // Add new data in token 
    usersData[email] = {
        name     : name,
        email    : email,
        password : pass,
        otp      : otp,
        updatedAt: new Date().toISOString()
    }
    
   // add json data back to file 

   try{

      await fs.writeFile(filePath, JSON.stringify(tokenData, null, 2), 'utf-8')

      console.log('refresh token save successfully in file')

   }catch(err){

    if(err.code = 'ENOENT'){
        console.log('file not found new file creating')

        await fs.writeFile(filePath, {}, 'utf-8')
    }else {

        console.log('something else wrong in refresh token saving ')
    }
   }

}

async function verifyVerificationData(email, otp){

    const filePath = path.join(__dirname,'tempUserData.json');
    let data = {};
    try{

         const fileData = await fs.readFile(filePath,'utf-8');
         data = JSON.parse(fileData);
         const userData = data[email];
         const expireTime = 15 * 60 * 1000;
         const totalTime  = (new Date().getTime() - new Date(userData.updatedAt).getTime());

         
         if (userData.otp !== otp){
             throw new Error("Otp mismatch ")
             return false
            }

            if (totalTime > expireTime ){
               throw new Error("Otp Expired, Request for new one!!")
               return false
            }
            
         if (userData.email !== email){
            throw new Error("User Data mismatch");
         }


    }catch(error){

    }
    return true;
}

async function verifyRefreshToken(id,token){
    return true;
}

module.exports = {
    saveRefreshToken,
    saveVerificationData,
    verifyVerificationData,
    verifyRefreshToken,
}