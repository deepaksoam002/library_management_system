const rateLimit = require('express-rate-limit');

const authLimit = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 20,
    message : "Too Many Request From Client"
});

module.exports = {
    authLimit,
};