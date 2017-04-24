'use strict';
// set up ======================================================================
// get all the tools we need
const express = require('express');
//const serveStatic = require('serve-static');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//const https = require('https');
const flash = require('connect-flash');
const morgan = require('morgan');
//const http = require('http');
const fs = require('fs');

mongoose.Promise = global.Promise; //ES6 Promise
const Schema = mongoose.Schema;
const session = require('express-session');

const configDB = require('./config/database.js');
/*const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')*/

const app = express();

/*const options = {
    key: sslkey,
    cert: sslcert
};*/

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

const teamSchema = new Schema({
    team: {
        type: String,
        required: true
    },
    player: {
        type: String,
        required: true
    },
    teamChar: {
        type: String,
        required: true
    },
    gamesPlayed: {
        type: Number,
        required: true
    },
    wins: {
        type: Number,
        required: true
    },
    loses: {
        type: Number,
        required: true
    },
    goalsFor: {
        type: Number,
        required: true
    },
    goalsAgainst: {
        type: Number,
        required: true
    },
    shotsFor: {
        type: Number,
        required: true
    },
    shotsAgainst: {
        type: Number,
        required: true
    },
    overtimes: {
        type: Number,
        required: true
    },
    overtimeWins: {
        type: Number,
        required: true
    },
    overtimeLoses: {
        type: Number,
        required: true
    },
    shootouts: {
        type: Number,
        required: true
    },
    shootoutWins: {
        type: Number,
        required: true
    },
    shootoutLoses: {
        type: Number,
        required: true
    },
    homeWins: {
        type: Number,
        required: true
    },
    homeLoses: {
        type: Number,
        required: true
    },
    guestWins: {
        type: Number,
        required: true
    },
    guestLoses: {
        type: Number,
        required: true
    }
});

const gameSchema = new Schema({
    homeTeam: {
        type: String,
        required: true
    },
    guestTeam: {
        type: String,
        required: true
    },
    homeGoals: {
        type: Number,
        required: true
    },
    guestGoals: {
        type: Number,
        required: true
    },
    guestShots: {
        type: Number,
        required: true
    },
    homeShots: {
        type: Number,
        required: true
    },
    isShootout: {
        type: Boolean,
        required: true
    },
    isOvertime: {
        type: Boolean,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

const Team = mongoose.model('team', teamSchema);
const Game = mongoose.model('game', gameSchema);

// routes ======================================================================
require('./app/routes.js')(app, passport, Team, Game); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(process.env.APP_PORT);
console.log('The magic happens on port ' + process.env.APP_PORT);





/*app.use(cookieParser());
app.use(bodyParser.json());


// Authentication
passport.use(new LocalStrategy(
    (username, password, done) => {
        console.log("before everything?");
        console.log(process.env.USERNAME);
        if (username !== process.env.USERNAME || password !== process.env.PASSWORD) {
            done(null, false, {
                message: 'Incorrect credentials.'
            });
            console.log('failed');
            return;
        }
        console.log('done');

        return done(null, {
            username: username
        });
    }
));

app.use(passport.initialize());
app.use(passport.session());

app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login.html',
        session: false
    }),
    (req, res) => {

        res.cookie('user', req.body.username, {
            maxAge: 900000,
            httpOnly: true
        });
        console.log('cookie created successfully');

        res.redirect('/index.html');
    }
);

app.get('/index.html', (req, res) => {
    console.log('index')
    console.log(req.cookies);
    if (req.cookies.user) {
        res.sendFile(__dirname + '/public/index.html');
    } else {
        console.log('no user')
        res.redirect('/login.html');
    }
});

app.get('/logout', (req, res) => {
    console.log('logout');
    console.log(res.cookies);
    console.log(req.cookies);
    res.clearCookie('user');

    console.log(res.cookies);
    console.log(req.cookies);
    res.redirect('/login.html');
});*/

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


app.post('/addteam', (req, res) => {
    const newteam = new Data(req.body);
    newteam.save(function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log('New team added');
            res.send(204);
        }
    });
});



app.post('/addgame', (req, res) => {
    console.log(req.body);
    console.log(req.body.isOvertime);
    console.log('test');

    //Game resul is added to db

    Game.create(req.body).then(post => {


    });

    //Declaring variables to update overtime/shootout data

    let isOvertime = 0;
    let gameEndedDuringOvertime = 0
    let isShootout = 0;

    // Checking if game went to overtime...

    if (req.body.isOvertime === 'true') {
        isOvertime = 1;
        gameEndedDuringOvertime = 1;

        //...if so checking if there were shootouts
        if (req.body.isShootout === 'true') {
            console.log('isShootout')
            isShootout = 1;
            gameEndedDuringOvertime = 0;
        }
    } else {
        console.log('noOvertime')
    }

    //Checking if home team won

    if (req.body.homeGoals > req.body.guestGoals) {


        //Updating winning team

        Team.findOneAndUpdate({
            'team': req.body.homeTeam
        }, {
            $inc: {
                gamesPlayed: 1,
                wins: 1,
                homeWins: 1,
                goalsFor: req.body.homeGoals,
                goalsAgainst: req.body.guestGoals,
                shotsFor: req.body.homeShots,
                shotsAgainst: req.body.guestShots,
                overtimes: isOvertime,
                overtimeWins: gameEndedDuringOvertime,
                shootouts: isShootout,
                shootoutWins: isShootout
            }
        }, {
            new: true
        }, (err, data) => {
            if (err) return handleError(err);

        });

        //Updating losing team

        Team.findOneAndUpdate({
            'team': req.body.guestTeam
        }, {
            $inc: {
                gamesPlayed: 1,
                loses: 1,
                guestLoses: 1,
                goalsFor: req.body.guestGoals,
                goalsAgainst: req.body.homeGoals,
                shotsFor: req.body.guestShots,
                shotsAgainst: req.body.homeShots,
                overtimes: isOvertime,
                overtimeLoses: gameEndedDuringOvertime,
                shootouts: isShootout,
                shootoutloses: isShootout
            }
        }, {
            new: true
        }, (err, data) => {
            if (err) return handleError(err);

        });

    } else {

        //Winning team is guest team
        //Updating winning team

        Team.findOneAndUpdate({
            'team': req.body.guestTeam
        }, {
            $inc: {
                gamesPlayed: 1,
                wins: 1,
                guestWins: 1,
                goalsFor: req.body.guestGoals,
                goalsAgainst: req.body.homeGoals,
                shotsFor: req.body.guestShots,
                shotsAgainst: req.body.homeShots,
                overtimes: isOvertime,
                overtimeWins: gameEndedDuringOvertime,
                shootouts: isShootout,
                shootoutWins: isShootout
            }
        }, {
            new: true
        }, (err, data) => {
            if (err) return handleError(err);

        });

        //Updating losing team

        Team.findOneAndUpdate({
            'team': req.body.homeTeam
        }, {
            $inc: {
                gamesPlayed: 1,
                loses: 1,
                homeLoses: 1,
                goalsFor: req.body.homeGoals,
                goalsAgainst: req.body.guestGoals,
                shotsFor: req.body.homeShots,
                shotsAgainst: req.body.guestShots,
                overtimes: isOvertime,
                overtimeLoses: gameEndedDuringOvertime,
                shootouts: isShootout,
                shootoutloses: isShootout
            }
        }, {
            new: true
        }, (err, data) => {
            if (err) return handleError(err);

        });
        res.sendStatus(204);
    }

});



app.post('/addplayer', (req, res) => {
    req.body.gamesPlayed = 0;
    req.body.wins = 0;
    req.body.loses = 0;
    req.body.goalsFor = 0;
    req.body.goalsAgainst = 0;
    req.body.shotsFor = 0;
    req.body.shotsAgainst = 0;
    req.body.overtimes = 0;
    req.body.overtimeWins = 0;
    req.body.overtimeLoses = 0;
    req.body.shootouts = 0;
    req.body.shootoutWins = 0;
    req.body.shootoutLoses = 0;
    req.body.homeWins = 0;
    req.body.homeLoses = 0;
    req.body.guestWins = 0;
    req.body.guestLoses = 0;
    console.log(req.body);

    const newteam = new Team(req.body);
    newteam.save(function(err) {
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
    Team.find().where({
        'team': req.params.team
    }).exec().then((team) => {
        if (team.length === 0) {
            res.send('No team named ' + req.params.team + ' found');
        } else {
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
    Team.find().exec().then((teams) => {
        if (teams.length === 0) {
            res.send('no teams found');
        } else {
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
        if (teams.length === 0) {
            res.send('no teams with more wins than ' + req.params.wins + ' found');
        } else {
            res.send(teams);
        }
    });
});

/*mongoose.connect(`    ).then(() => {
    console.log('Mongodb connected successfully.');
    app.use(express.static(path.join(__dirname, 'public')));

    https.createServer(options, app).listen(process.env.APP_PORT);

    console.log('listening port: ' + process.env.APP_PORT);
}, err => {
    console.log('Connection to db failed: ' + err);
});*/

/*http.createServer((req, res) => {
      res.writeHead(301, { 'Location': 'https://localhost:8080' + req.url });
      res.end();
}).listen(3000);*/