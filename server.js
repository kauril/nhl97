'use strict'
const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise; //ES6 Promise
const Schema = mongoose.Schema;
const router = express.Router();

const dataSchema = new Schema({
    name: String,
    age: Number,
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },
    color: String,
    weight: Number
});

const Data = mongoose.model('cat', dataSchema);

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`).then(() => {
    console.log('Connected successfully youuu.');
    Data.find().exec().then((cats) => {
        console.log(`Got ${cats.length} cats`);
    });
    app.get('/', (req, res) => {
        res.send('Hello Worldsadasdas!');
    });
    app.use(express.static(path.join(__dirname, 'public')));
    app.on('listening',() => {
        console.log('ok, server is running');
    });
    app.listen(process.env.APP_PORT);
}, err => {
    console.log('Connection to db failed: ' + err);
});



