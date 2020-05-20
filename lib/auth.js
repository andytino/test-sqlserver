const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy({ usernameField: 'username'}, async (username, password, done) => {
    try {

    } catch(err){
        return done(err)
    }
}))

module.exports = {
    initialize: passport.initialize(),
    session: passport.session(),
    setUSer: (req, res, next) => {
        res.locals.user = req.user;
        return next();
    }
}