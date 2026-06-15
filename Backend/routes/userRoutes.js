const express = require('express');
const router = express.Router();
const sql = require('../config/db');
const {handleNewUserRegistration} = require('../models/newUserModel');


router.get('/',async(req, res) =>{
     try {
          const result = await sql.query('Select * From users');
        return res.status(200).json(result.rows);
     } catch (error) {
        return res.status(400).json({message:'Database connection failed!!'})
     }
     return res.status(500).json({message: 'Server not responding!! '})
})

router.post('/login',async(req, res) =>{
   

    res.status(200).json({message:"this is post request from user router"})

})

router.post('/register', handleNewUserRegistration);

router.put('/',(req, res) =>{
     res.status(200).json({message:"this is put request from user router"})

})

router.delete('/',(req, res) =>{
      res.status(200).json({message:"this is delete request from user router"})

})


module.exports = router;