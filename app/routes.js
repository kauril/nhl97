'use strict';
const Team = require('./models/team.js');
const Game = require('./models/game.js');
const functions = require('./models/functions.js');

module.exports = (app, passport, io) => {

    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            console.log('user disconnected');
            socket.rooms;
        });
        socket.on('message', (msg) => {   
            socket.emit('message', 'this is a message send by server');
        });
    });

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', (req, res) => {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', (req, res) => {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/main', // redirect to the secure home section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', (req, res) => {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });


    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/main', // redirect to the secure home section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // MAIN VIEW(HOME WHEN LOGGED IN) ======
    // =====================================

    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/main', isLoggedIn, (req, res) => {
        console.log(req.user);
        res.render('main.ejs', {
            user: req.user
        });
    });

    // =====================================
    // STATISTICS ==========================
    // =====================================

    app.get('/teamstatistics', isLoggedIn, (req, res) => {
        console.log(req.user);
        res.render('teamstatistics.ejs', {
            user: req.user
        });
    });

    app.get('/overallstatistics', isLoggedIn, (req, res) => {
        console.log(req.user);
        res.render('overallstatistics.ejs', {
            user: req.user
        });
    });

     app.get('/compare_two_teams', isLoggedIn, (req, res) => {
        console.log(req.user);
        res.render('compareTwoTeams.ejs', {
            user: req.user
        });
    });

     app.get('/images', isLoggedIn, (req, res) => {
        console.log(req.user);
        res.render('images.ejs', {
            user: req.user
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // TEAMS ===============================
    // =====================================

    app.get('/teams', (req, res) => {
        Team.find().exec().then((teams) => {
            if (teams.length === 0) {
                res.send('no teams found');
            } else {
                res.send(teams);
            }
        });
    });

    app.get('/team/:team', (req, res) => {
        console.log(req.params.team);
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

    app.get('/overall_statistics/:param', (req, res) => {
        const query = {};
        query[req.params.param] = -1;
        Team.find().sort(query).limit(10).exec().then((result) => {
            if (result.length === 0) {
                res.send('No statistics with argument ' + req.params + ' found');
            } else {
                res.send(result);
            }
        });

    });

    // =====================================
    // GAMES ===============================
    // =====================================

    app.get('/games', (req, res) => {
        Game.find().sort({
            "_id": -1
        }).limit(10).exec().then((games) => {
            if (games.length === 0) {
                res.send('no games found');
            } else {
                res.send(games);

            }
        });
    });

    // =====================================
    // ANDROID POSTS =======================
    // =====================================

    app.post('/addgame', (req, res) => {

        // Adding game to db
        functions.addGame(req.body);
        
        //Declaring variables to update overtime/shootout data
        let isOvertime = functions.checkIfOvertime(req.body);
        let isShootout = functions.checkIfShootout(req.body);
        let gameEndedDuringOvertime = functions.checkIfGameEndedDuringOvertime(isOvertime, isShootout);

        //Checking if home team won
        if (req.body.homeGoals > req.body.guestGoals) {

            //Winning team is home team
            //Updating winning team
            functions.updateWinningHomeTeam(req.body, isOvertime, isShootout, gameEndedDuringOvertime);

            //Updating losing team
            functions.updateLosingGuestTeam(req.body, isOvertime, isShootout, gameEndedDuringOvertime);

            io.sockets.emit('newgame', 'winning home' + req.body.homeTeam);
            res.sendStatus(204);

        } else {

            //Winning team is guest team
            //Updating winning team
            functions.updateWinningGuestTeam(req.body, isOvertime, isShootout, gameEndedDuringOvertime);

            //Updating losing team
            functions.updateLosingHomeTeam(req.body, isOvertime, isShootout, gameEndedDuringOvertime);

            io.sockets.emit('newgame', 'winning guest');
            res.sendStatus(204);
        }

    });

    //Add new team with a player to the db
    app.post('/addplayer', (req, res) => {
        functions.addNewTeam(req.body, io, res);
    });
};

// route middleware to make sure a user is logged in
const isLoggedIn = (req, res, next) => {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

