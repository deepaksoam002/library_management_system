const passport = require('passport');
const googleStrateiges = require('passport-google-oauth20');
const config = require('./config');



passport.use(new googleStrateiges({
    clientID: config.googleauth.clientID,
    clientSecret: config.googleauth.clientSecret,
    callbackURL: "/auth/google/callback"
}, function(accessToken, refreshToken, profile, cb){


}))

