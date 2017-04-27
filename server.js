'use strict';
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//const https = require('https');

const flash = require('connect-flash');
const morgan = require('morgan');

const fs = require('fs');
const https = require('https');//.Server(app);
const io = require('socket.io');
mongoose.Promise = global.Promise; //ES6 Promise

const session = require('express-session');
const configDB = require('./config/database.js');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')

const options = {
    key: sslkey,
    cert: sslcert
};



// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());// get information from html forms
app.use(bodyParser.urlencoded({extended: true}));


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

const server = https.createServer(options, app);

server.listen(8080);

const newIO = new io();
newIO.attach(server);

// routes ======================================================================
require('./app/routes.js')(app, passport, newIO); // load our routes and pass in our app and fully configured passport

app.use(express.static(path.join(__dirname, 'public')));

// launch ======================================================================
//https.createServer(options, app).listen(process.env.APP_PORT);
//server.listen(8080);




//http redirection
/*http.createServer((req, res) => {
      res.writeHead(301, { 'Location': 'https://localhost:3000' + req.url });
      res.end();
}).listen(process.env.APP_PORT);*/

console.log('The magic happens on port ' + process.env.APP_PORT);







