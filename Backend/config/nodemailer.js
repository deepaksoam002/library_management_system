const nodemailer = require('nodemailer');
const config = require('../config/config');
const { getMaxListeners } = require('nodemailer/lib/xoauth2');

const transporter = nodemailer.createTransport({
    service : 'gmail',
    secure : true,
    auth : {
         user: config.email.user,
         pass: config.email.pass
    }
});

module.exports = transporter;
