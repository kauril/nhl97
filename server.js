'use strict';
const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise; //ES6 Promise
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    team: {type: String,  required: true},
    char: {type: String,  required: true},
    gamesplayed: {type: Number,  required: true},
    wins: {type: Number,  required: true},
    loses: {type: Number,  required: true},
    goalsfor: {type: Number,  required: true},
    goalsagainst: {type: Number,  required: true},
    shotsfor: {type: Number,  required: true},
    shotsagainst: {type: Number,  required: true},
    overtimes: {type: Number,  required: true},
    overtimewins: {type: Number,  required: true},
    overtimeloses: {type: Number,  required: true},
    shootouts: {type: Number,  required: true},
    shootoutwins: {type: Number,  required: true},
    shootoutloses: {type: Number,  required: true},
    homewins: {type: Number,  required: true},
    homeloses: {type: Number,  required: true},
    guestwins: {type: Number,  required: true},
    guestloses: {type: Number,  required: true}
});

const Data = mongoose.model('nhl97', dataSchema);

app.use(bodyParser.json());

/**
 * @apiDefine ExampleResult
 * @apiSuccess {String} _id Unique team id
 * @apiSuccess {String} team Name of the team
 * @apiSuccess {Int} gamesplayed Games Played
 * @apiSuccess {Int} wins Wins
 * @apiSuccess {Int} loses Loses
 * @apiSuccess {Int} goalsfor Goals for
 * @apiSuccess {Int} goalsagainst Goals against
 * @apiSuccess {Int} shotsfor Shots for
 * @apiSuccess {Int} shotsagainst Shots against
 * @apiSuccess {Int} overtimes Overtimes
 * @apiSuccess {Int} overtimewins Overtime wins
 * @apiSuccess {Int} overtimeloses Overtime loses
 * @apiSuccess {Int} shootouts Shootouts
 * @apiSuccess {Int} shootoutwins Shootout wins
 * @apiSuccess {Int} shootoutloses Shootout loses
 * @apiSuccess {Int} homewins Home wins
 * @apiSuccess {Int} homeloses Home loses
 * @apiSuccess {Int} guestwins Guest wins
 * @apiSuccess {Int} guestloses Guest loses
 */

/**
 * @api {post} /addteam Add new team
 * @apiName PostTeam
 * @apiGroup Teams
 * @apiUse ExampleResult
 * @apiSuccessExample Example data on success:
 * {
    "_id" : ObjectId("58e771f3fe906d397a64859b"),
    "team" : "florida",
    "char" : "l",
    "gamesplayed" : 0,
    "wins" : 0,
    "loses" : 0,
    "goalsfor" : 0,
    "goalsagainst" : 0,
    "shotsfor" : 0,
    "shotsagainst" : 0,
    "overtimes" : 0,
    "overtimewins" : 0,
    "overtimeloses" : 0,
    "shootouts" : 0,
    "shootoutwins" : 0,
    "shootoutloses" : 0,
    "homewins" : 0,
    "homeloses" : 0,
    "guestwins" : 0,
    "guestloses" : 0
}
 *@apiError Err Error defining missing value is send in response
 */


app.post('/addteam', bodyParser.urlencoded({extend: true}), (req, res) => {
    const newteam = new Data(req.body);
    newteam.save(function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log('New team added');
            res.send(204);
        }
    });
});

/**
 * @api {get} /team/:team Get one Team
 * @apiName GetTeam
 * @apiParam {String} team Name of the desired team.
 * @apiGroup Teams
 * @apiUse ExampleResult
 * @apiSuccessExample Example data on success:
 * {
    "_id" : ObjectId("58e771f3fe906d397a64859b"),
    "team" : "florida",
    "char" : "l",
    "gamesplayed" : 0,
    "wins" : 0,
    "loses" : 0,
    "goalsfor" : 0,
    "goalsagainst" : 0,
    "shotsfor" : 0,
    "shotsagainst" : 0,
    "overtimes" : 0,
    "overtimewins" : 0,
    "overtimeloses" : 0,
    "shootouts" : 0,
    "shootoutwins" : 0,
    "shootoutloses" : 0,
    "homewins" : 0,
    "homeloses" : 0,
    "guestwins" : 0,
    "guestloses" : 0,
    "__v" : 0
}
 *@apiError Error String 'No team named <code>team</code> found' send in response
 */

app.get('/team/:team', (req, res) => {
    Data.find().where({'team' : req.params.team}).exec().then((team) => {
        if(team.length === 0){
             res.send('No team named ' + req.params.team + ' found');
        }else {
            res.send(team);
        }
    });
});

/**
 * @api {get} /teams Get all teams
 * @apiName GetTeams
 * @apiGroup Teams
 * @apiSuccess {JSON} Teams All teams from database received
 * @apiSuccessExample Example data on success:
 * [{
    "_id" : ObjectId("58e771f3fe906d397a64859b"),
    "team" : "florida",
    "char" : "l",
    "gamesplayed" : 0,
    "wins" : 0,
    "loses" : 0,
    "goalsfor" : 0,
    "goalsagainst" : 0,
    "shotsfor" : 0,
    "shotsagainst" : 0,
    "overtimes" : 0,
    "overtimewins" : 0,
    "overtimeloses" : 0,
    "shootouts" : 0,
    "shootoutwins" : 0,
    "shootoutloses" : 0,
    "homewins" : 0,
    "homeloses" : 0,
    "guestwins" : 0,
    "guestloses" : 0,
    "__v" : 0
},{
    "_id" : ObjectId("58e771f3fe906d397a64859b"),
    "team" : "New York",
    "char" : "l",
    "gamesplayed" : 0,
    "wins" : 0,
    "loses" : 0,
    "goalsfor" : 0,
    "goalsagainst" : 0,
    "shotsfor" : 0,
    "shotsagainst" : 0,
    "overtimes" : 0,
    "overtimewins" : 0,
    "overtimeloses" : 0,
    "shootouts" : 0,
    "shootoutwins" : 0,
    "shootoutloses" : 0,
    "homewins" : 0,
    "homeloses" : 0,
    "guestwins" : 0,
    "guestloses" : 0,
    "__v" : 0
}]
 *@apiError Error String 'No teams found' send in response
 */

app.get('/teams', (req, res) => {
    Data.find().exec().then((teams) => {
        if(teams.length === 0){
            res.send('no teams found');
        }else {
            res.send(teams);
        }
    });
});

/**
 * @api {get} /morewinsthan/:wins Get all teams based on amount of winnings
 * @apiName GetTeamsBasedOnWinnings
 * @apiGroup Teams
 * @apiParam {Number} wins Lower limit of winnings. Results with more than this will be received in response
 * @apiUse ExampleResult
 * @apiSuccessExample Example data on success:
 * [{
    "_id" : ObjectId("58e771f3fe906d397a64859b"),
    "team" : "florida",
    "char" : "l",
    "gamesplayed" : 0,
    "wins" : 8,
    "loses" : 0,
    "goalsfor" : 0,
    "goalsagainst" : 0,
    "shotsfor" : 0,
    "shotsagainst" : 0,
    "overtimes" : 0,
    "overtimewins" : 0,
    "overtimeloses" : 0,
    "shootouts" : 0,
    "shootoutwins" : 0,
    "shootoutloses" : 0,
    "homewins" : 0,
    "homeloses" : 0,
    "guestwins" : 0,
    "guestloses" : 0,
    "__v" : 0
},{
    "_id" : ObjectId("58e771f3fe906d397a64859b"),
    "team" : "New York",
    "char" : "l",
    "gamesplayed" : 0,
    "wins" : 5,
    "loses" : 0,
    "goalsfor" : 0,
    "goalsagainst" : 0,
    "shotsfor" : 0,
    "shotsagainst" : 0,
    "overtimes" : 0,
    "overtimewins" : 0,
    "overtimeloses" : 0,
    "shootouts" : 0,
    "shootoutwins" : 0,
    "shootoutloses" : 0,
    "homewins" : 0,
    "homeloses" : 0,
    "guestwins" : 0,
    "guestloses" : 0,
    "__v" : 0
}]
 *@apiError Error String 'no teams with more wins than <code>wins</code> found' send in response
 */

app.get('/morewinsthan/:wins', (req, res) => {
    Data.find().where('wins').gt(req.params.wins).exec().then((teams) => {
        if(teams.length === 0){
            res.send('no teams with more wins than ' + req.params.wins + ' found');
        }else {
            res.send(teams);
        }
    });
});

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`).then(() => {
    console.log('Mongodb connected successfully.');
    app.use(express.static(path.join(__dirname, 'public')));
    app.listen(process.env.APP_PORT);
}, err => {
    console.log('Connection to db failed: ' + err);
});



