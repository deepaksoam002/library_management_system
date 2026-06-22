const express = require('express');
const router = express.Router();
const {handleNewUserRegistration,
       handleEmailVerification,
       handleEmailVerificationTokenValidation,
       handleGoogleSignup,
       handleUserLogin,
       handleUserLogout,
       handleForgotPassword,
       handleResetPassword
     } = require('../controllers/authController');


// Handle new user registration ---
router.post('/signup', handleNewUserRegistration);

// handle email verification ---
router.post('/send-verification', handleEmailVerification); 

// handle email verification token validation ---
router.get('/verify-email/:token', handleEmailVerificationTokenValidation); 

// Handle new user signup with Google ---
router.get('/google', handleGoogleSignup); 

// Handle Google O auth  callback route
router.get('/auth/google/callback', handleGoogleCallback)

// Handle user login ---
router.post('/login', handleUserLogin); 

// handle logout request ---
router.delete('/logout', handleUserLogout); 

// handle forget password request ---
router.post('/forgot-password/:token', handleForgotPassword); 

// handle reset password request ---
router.post('/reset-password', handleResetPassword);



module.exports = router;