const passport = require('passport')
LocalStrategy = require('passport-local')
bcrypt = require('bcrypt-nodejs')

// Serialize the User
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
})

// Deserialize the User
passport.deserializeUser(function(id, cb) {
    User.findOne({id}).exec(function(err, user){
        cb(err, user);
    })
})

// Local 
passport.use(new LocalStrategy({
    usernameField: 'username',
    passportField: 'password'
    }, function(username, password, cb) {
    
        User.findOne({username: username}).exec(function(err, user){
        if (err) {
            return cb(err);
        }
        if (!user) {
            return cb(null, false, {message: 'Username not found'});  
        }
            
        bcrypt.compare(password, user.password, function(err, res) {
            if (!res) {
                return cb(null, false, {message: 'Invalid password'});  
            }
            return cb(null, user, {message: "Login successful"});
        })    
    });
}));