const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// mongoose.promise  = require('bluebird');
// console.log('APP')
//connect to database
mongoose.connect(config.database,  { useMongoClient: true});

//on Connection 
mongoose.connection.on('connected' , () => { 
    console.log('Connected to Database' + config.database);
});

//ON error
mongoose.connection.on('err' , () => {
    console.log('Database error: ' + err);
});

const app = express();

const users = require('./routes/users');
const admin = require('./routes/admin');

// Port Number
// const port = process.env.PORT || 3000;
const port =  3000;

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/admin', admin);

// Index Route
app.get('/', (req, res) => {
  res.send('invaild endpoint');
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});