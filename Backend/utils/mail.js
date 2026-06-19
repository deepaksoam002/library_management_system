const transporter = require('../config/nodemailer');
const config = require('../config/config');


async function sendEmail(userData){
  try{
     
    const options = createEmail(userData);
    const info = await transporter.sendMail(options)
    return true;

  }catch(error){
    throw new Error("Error : Unable to send email. Try again!!")
  }
}




// object mailData contain keys  to, emailType, otp, name, resetLink, newLink  


async function createEmail(mailData){
    try{
    const mailoptions = {
        from : config.email.user,
        to : mailData.to,
        subject : await getsubject(mailData.emailType),
        body: await getEmailBody(mailData)
    }
    return mailoptions; 
  } catch(error){

    throw new Error("Failed to get mailoptions", error);
  }
}


function getsubject(emailType){
    switch(emailType){
        case 'emailVerification':
            return 'Verify Your Account - OTP Inside';
        case 'passwordReset':
            return 'Reset Your Password - Link Inside';
        default:
            throw new Error('Invalid email type!!');
    }
};


function getEmailBody(mailData){
    
    switch(mailData.emailType){
        case 'emailVerification':
            return emailVerificationBody(mailData.otp, mailData.name);
        case 'passwordReset':
            return passwordResetBody(mailData.newlink, mailData.resetLink);
        default: 
            throw new Error ('Inavlid email type!!'); 
    }
}


function emailVerificationBody(Otp, Name){
    return`
     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff;">
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">Hi ${Name},</p>
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">Thank you for registering with --- Library </p>
      
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">
        Your one-Time Password(OTP) for verifying your account is:
      </p>
      <div style="text-align: left; margin: 30px 0; padding: 15px;  border-radius: 5px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #5A20E6;">${Otp}</span>
      </div>
      <p style="color: #555555; font-size: 14px; line-height: 1.5;">
        This code is valid for <strong>5 minutes</strong>.Please do not share it with anyone.
       </p>
       <p style="color: #555555; font-size: 14px; line-height: 1.5;"> If you did not request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin-top: 30px;" />
      <p style="color: #999999; font-size: 12px; text-align: center;">
        This is an automated message. Please do not reply.
      </p>
    </div 
    `
};


function passwordResetBody(newlink, resetLink){
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;  background-color: #ffffff;">
      <h2 style="color: #333333; text-align: center;">Reset Your Password</h2>
      <div style ="padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff;">
      <p style="color: #555555; font-size: 14px; line-height: 1.5;">
        We heard that you lost your Library Management password. Sorry about that!
      </p>
      <p style="color: #555555; font-size: 14px; line-height: 1;">
        But don't worry! You can use the following button to reset your password:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">
        If you don't use this link within 3 hours, it will expire.<a href="${newlink}" style="color: #4F46E5; word-break: break-all;">Click here to get a new password reset link.</a>
      </p>
      <p style="color: #555555; font-size: 14px; "><br>Thanks,</p>
      <p style="color: #555555; font-size: 14px; ">The Library Team</p>
      
      <hr style="border: none; border-top: 1px solid #eaeaea; margin-top: 30px;" />
      <p style="color: #999999; font-size: 12px; text-align: center;">
        Secure App Inc. &copy; ${new Date().getFullYear()}
      </p>
      </div>
    </div>
    
    `
};


module.exports = sendEmail;


