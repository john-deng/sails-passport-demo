const passport = require('passport')
const LocalStrategy = require('passport-local')
const CustomStrategy = require('passport-custom').Strategy;
const ConnectCas = require('connect-cas2');
bcrypt = require('bcrypt-nodejs')

// Serialize the User
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
})

// Deserialize the User
passport.deserializeUser(function (id, cb) {
  
  User.findOne({
    id
  }).exec(function (err, user) {
    if (user) {
      cb(err, user);
    } else {
      cb(err, {id: id})
    }
  })

})

// Local 
passport.use(new LocalStrategy({
  usernameField: 'username',
  passportField: 'password'
}, function (username, password, cb) {

  User.findOne({
    username: username
  }).exec(function (err, user) {
    if (err) {
      return cb(err);
    }
    if (!user) {
      return cb(null, false, {
        message: 'Username not found'
      });
    }

    bcrypt.compare(password, user.password, function (err, res) {
      if (!res) {
        return cb(null, false, {
          message: 'Invalid password'
        });
      }
      return cb(null, user, {
        message: "Login successful"
      });
    })
  });
}));

// CAS 
var servicePrefix = process.env.SVC_PREFIX || 'http://localhost:3000';
var serverPath = process.env.SERVER_PATH || 'http://localhost:8080';
var options = {
  ignore: [
    /^\/$/,
    /\/(explore|login|logout)$/,
    /\..*$/
  ],
  match: [],
  servicePrefix:  servicePrefix,
  serverPath: serverPath,
  paths: {
    restletIntegration: true,
    validate: process.env.VALIDATE || '/cas/validate',
    serviceValidate: process.env.SVC_VALIDATE || '/cas/serviceValidate',
    proxy: process.env.PROXY || '/cas/proxy',
    login: process.env.LOGIN_PATH || '/cas/login',
    logout: process.env.LOGOUT_PATH || '/cas/logout',
    proxyCallback: ''
  },
  redirect: false,
  gateway: false,
  renew: false,
  slo: true,
  cache: {
    enable: true,
    ttl: 5 * 60 * 1000,
    filter: []
  },
  fromAjax: {
    header: 'x-client-ajax',
    status: 418
  }
};

var casClient = new ConnectCas(options);
var casClientCore = casClient.core();
var customStrategy = new CustomStrategy(function(req, verified){
  if (req.session.cas) {
    var user = {
      id: req.session.cas.user
    };
    this.success(
      user, 
      {message: 'user ' + user.id + ' logged in'}
    );
    
  } else {
    casClientCore(req, req.res, req.next)
  }
});

customStrategy.logout = function(req, res) {
  req.logout();
  this.casClient.logout(req, res);
};

passport.use('cas', customStrategy);
