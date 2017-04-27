const Team = require('./models/team.js');
const Game = require('./models/game.js');

module.exports = function(app, passport, io) {

    io.on('connection', function(socket) {


        socket.on('disconnect', function() {
            console.log('user disconnected');
            socket.rooms;
        });
        socket.on('message', function(msg) {
            console.log('message coming from client');
            console.log(msg);

            socket.emit('message', 'this is a message send by server');

        });
    });



    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', (req, res) => {
        console.log('in a root');

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

    // =====================================
    // GAMES ===============================
    // =====================================

    app.get('/games', (req, res) => {
        Game.find().sort({"_id":-1}).limit(10).exec().then((games) => {
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
        console.log(req.body);


        //Game resul is added to db
        Game.create(req.body).then(post => {
            console.log('game added');
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

            //Winning team is home team
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
                    shootoutLoses: isShootout
                }
            }, {
                new: true
            }, (err, data) => {
                if (err) return handleError(err);

            });

            io.sockets.emit('newgame    ', 'winning home' + req.body.homeTeam);
            console.log('emitting above');
            res.sendStatus(204);

        } else {

            //Winning team is guest team
            //Updating winning team
            console.log(isShootout);    
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
                    shootoutLoses: isShootout
                }
            }, {
                new: true
            }, (err, data) => {
                if (err) return handleError(err);

            });


            io.sockets.emit('newgame', 'winning guest');
            console.log('emitting above');
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
                io.sockets.emit('newteam', req.body);
                res.sendStatus(204);
            }
        });

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