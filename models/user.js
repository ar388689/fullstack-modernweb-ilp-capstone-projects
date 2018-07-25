const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema ({
  firstName: {
    type: String
},
lastName: {
    type: String
},
emailID: {
    type: String,
    required: true
},
password: {
    type: String,
    required: true
},
location: {
    type: String
},
mobileNo: {
    type: String
},
role: {
    type: String,
    enum: ['user','admin'],
    // default: 'user'
}
  }, {
    collection: 'users'
});
  
  const User = module.exports = mongoose.model('User', UserSchema);

  module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
  }
  
  module.exports.getUserByEmailID = function(emailID,callback) {
    const query = {emailID: emailID}
    User.findOne(query, callback);   
  }  

  module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;
        newUser.password = hash;
        newUser.save(callback);
      });
    });
  }
  module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err) throw err;
      callback(null, isMatch);
    });
  }