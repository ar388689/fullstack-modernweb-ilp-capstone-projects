const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User ({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
     emailID: req.body.emailID,
     password: req.body.password,
     location: req.body.location,
     mobileNo: req.body.mobileNo,
     role: req.body.role
  });

  User.addUser(newUser, (err, user) => {
    if(err) {
      res.json({success: false, msg: 'Failed to register user'});
    } else {
      res.json({success: true, msg: 'User registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const emailID = req.body.emailID;
  const password = req.body.password;
  const role =  req.body.role;

  if(role == 'user' || role == 'admin') {
    User.getUserByEmailID(emailID, (err, user)=> {
    if(err)
    throw err;
    if(!user) {
        return  res.json({success: false, msg: 'User not registered!'});
    }
   User.comparePassword(password, user.password, (err, isMatch) => {
    if(err) throw err;
    if(isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
           // expiresIn: 60480 
        });
  res.json({
     success: true,
     token: 'JWT '+token,
     user: {
         id: user._id,
         firstName: user.firstName,
         lastName: user.lastName,
         emailID: user.emailID,
         location: user.location,
         mobileNo: user.mobileNo,
         role: user.role
     }
 });
}
    else {
        return res.json({success: false, msg: 'wrong password'});
    }
});
});
}
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
  // console.log(req.user);
});

module.exports = router;
