/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const passport = require('passport');
// var cas = require('../../config/passport').Cas

function login(req, res, strategy) {

  passport.authenticate(strategy, done)(req, res);
  
  function done(err, user, info) {
    if (err || !user) {
      return res.send({
        message: info.message,
        user
      });
    }
  
    req.login(user, function (err) {
      if (err) {
        sails.log(err)
        res.send(err);
      } else {
        sails.log('User ' + user.id + ' has logged in.');
        req.user = user;
        return res.redirect('/');
      }
    })
  }
}

module.exports = {
  // Local Login function 
  login: function(req, res) {
    login(req, res, 'local');
  },
  
  // CAS Login function
  casLogin: function (req, res) {
    login(req, res, 'cas');
  },

  // Logout function 
  logout: function (req, res) {
    if (req.user)
      sails.log('user ' + req.user.id + ' logged out')

    req.logout();
    res.redirect('/');
  },

  // Register function 
  register: function (req, res) {
    //TODO: form validation here
    data = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      description: req.body.description
    }
    console.log(data);

    User.create(data).fetch().exec(function (err, user) {
      if (err) return res.negoiate(err);
      console.log(user);

      // TODO: Maybe send confirmation email to the user before login
      req.login(user, function (err) {
        if (err) return res.negotiate(err);
        sails.log('User ' + user.id + ' has logged in.');
        return res.redirect('/');
      })
    })
  }
};