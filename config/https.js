module.exports = {

const fs = require('fs');
const https = require('https');
const sslkey = fs.readFileSync('../ssl-key.pem');
const sslcert = fs.readFileSync('../ssl-cert.pem');

const options = {
    key: sslkey,
    cert: sslcert
};

const testt = 'dsadsads';
};