const Team = require('./team.js');
const Game = require('./game.js');

module.exports = {

    // Adds game result to db

    addGame: (game) => {
        Game.create(game).then(post => {
            console.log('game added');
        });
    },

    // Checking if game went to overtime...

    checkIfOvertime: (game) => {
        if (game.isOvertime === 'true') {
            return 1;
        } else {
            console.log('noOvertime')
            return 0;
        }
    },

    // Checking if there were shootouts
    checkIfShootout: (game) => {
        if (game.isShootout === 'true') {
            console.log('isShootout')
            return 1;
        } else {
            return 0;
        }
    },

    // Checking if game ended during overtime

    checkIfGameEndedDuringOvertime: (isOvertime, isShootout) => {
        if (isOvertime > 0) {
            if (isShootout > 0) {
                return 0;
            } else {
                return 1;
            }
        } else {
            return 0;
        }
    },

    // Updates winning home team collection

    updateWinningHomeTeam: (game, isOvertime, isShootout, gameEndedDuringOvertime) => {
        Team.findOneAndUpdate({
            'team': game.homeTeam
        }, {
            $inc: {
                gamesPlayed: 1,
                wins: 1,
                homeWins: 1,
                goalsFor: game.homeGoals,
                goalsAgainst: game.guestGoals,
                shotsFor: game.homeShots,
                shotsAgainst: game.guestShots,
                overtimes: isOvertime,
                overtimeWins: gameEndedDuringOvertime,
                shootouts: isShootout,
                shootoutWins: isShootout

            }
        }, {
            new: true
        }, (err, data) => {
            if (err) return handleError(err);
            Team.findOneAndUpdate({
                    'team': game.homeTeam,
                    'otherTeams.team': game.guestTeam
                }, {
                    $inc: {
                        'otherTeams.$.gamesPlayed': 1,
                        'otherTeams.$.loses': 1,
                        'otherTeams.$.guestLoses': 1,
                        'otherTeams.$.goalsFor': parseInt(game.guestGoals),
                        'otherTeams.$.goalsAgainst': parseInt(game.homeGoals),
                        'otherTeams.$.shotsFor': parseInt(game.guestShots),
                        'otherTeams.$.shotsAgainst': parseInt(game.homeShots),
                        'otherTeams.$.overtimes': isOvertime,
                        'otherTeams.$.overtimeLoses': gameEndedDuringOvertime,
                        'otherTeams.$.shootouts': isShootout,
                        'otherTeams.$.shootoutLoses': isShootout
                    }
                },
                (err, result) => {
                    if (!err) {
                        console.log('resulttii')
                        console.log(result);
                    } else {
                        console.log('vituks män');
                        console.log(err);
                    }
                });
        });
    },

    // Updates losing guest team

    updateLosingGuestTeam: (game, isOvertime, isShootout, gameEndedDuringOvertime) => {
        Team.findOneAndUpdate({
            'team': game.guestTeam
        }, {
            $inc: {
                gamesPlayed: 1,
                loses: 1,
                guestLoses: 1,
                goalsFor: game.guestGoals,
                goalsAgainst: game.homeGoals,
                shotsFor: game.guestShots,
                shotsAgainst: game.homeShots,
                overtimes: isOvertime,
                overtimeLoses: gameEndedDuringOvertime,
                shootouts: isShootout,
                shootoutLoses: isShootout
            }
        }, {
            new: true
        }, (err, data) => {
            if (err) return handleError(err);
            Team.findOneAndUpdate({
                    'team': game.guestTeam,
                    'otherTeams.team': game.homeTeam
                }, {
                    $inc: {
                        'otherTeams.$.gamesPlayed': 1,
                        'otherTeams.$.wins': 1,
                        'otherTeams.$.homeWins': 1,
                        'otherTeams.$.goalsFor': parseInt(game.homeGoals),
                        'otherTeams.$.goalsAgainst': parseInt(game.guestGoals),
                        'otherTeams.$.shotsFor': parseInt(game.homeShots),
                        'otherTeams.$.shotsAgainst': parseInt(game.guestShots),
                        'otherTeams.$.overtimes': isOvertime,
                        'otherTeams.$.overtimeLoses': gameEndedDuringOvertime,
                        'otherTeams.$.shootouts': isShootout,
                        'otherTeams.$.shootoutLoses': isShootout
                    }
                },
                (err, result) => {
                    if (!err) {
                        console.log('resulttii')
                        console.log(result);
                    } else {
                        console.log('vituks män');
                        console.log(err);
                    }
                });
        });
    },

    // Updates winning guest team

    updateWinningGuestTeam: (game, isOvertime, isShootout, gameEndedDuringOvertime) => {
        Team.findOneAndUpdate({
            'team': game.guestTeam
        }, {
            $inc: {
                gamesPlayed: 1,
                wins: 1,
                guestWins: 1,
                goalsFor: game.guestGoals,
                goalsAgainst: game.homeGoals,
                shotsFor: game.guestShots,
                shotsAgainst: game.homeShots,
                overtimes: isOvertime,
                overtimeWins: gameEndedDuringOvertime,
                shootouts: isShootout,
                shootoutWins: isShootout
            }
        }, {
            new: true
        }, (err, data) => {
            if (err) return handleError(err);
            Team.findOneAndUpdate({
                    'team': game.guestTeam,
                    'otherTeams.team': game.homeTeam
                }, {
                    $inc: {
                        'otherTeams.$.gamesPlayed': 1,
                        'otherTeams.$.loses': 1,
                        'otherTeams.$.homeLoses': 1,
                        'otherTeams.$.goalsFor': parseInt(game.homeGoals),
                        'otherTeams.$.goalsAgainst': parseInt(game.guestGoals),
                        'otherTeams.$.shotsFor': parseInt(game.homeShots),
                        'otherTeams.$.shotsAgainst': parseInt(game.guestShots),
                        'otherTeams.$.overtimes': isOvertime,
                        'otherTeams.$.overtimeLoses': gameEndedDuringOvertime,
                        'otherTeams.$.shootouts': isShootout,
                        'otherTeams.$.shootoutLoses': isShootout
                    }
                },
                (err, result) => {
                    if (!err) {
                        console.log('resulttii')
                        console.log(result);
                    } else {
                        console.log('vituks män');
                        console.log(err);
                    }
                });
        });
    },

    // Updates losing home team

    updateLosingHomeTeam: (game, isOvertime, isShootout, gameEndedDuringOvertime) => {
        Team.findOneAndUpdate({
            'team': game.homeTeam
        }, {
            $inc: {
                gamesPlayed: 1,
                loses: 1,
                homeLoses: 1,
                goalsFor: game.homeGoals,
                goalsAgainst: game.guestGoals,
                shotsFor: game.homeShots,
                shotsAgainst: game.guestShots,
                overtimes: isOvertime,
                overtimeLoses: gameEndedDuringOvertime,
                shootouts: isShootout,
                shootoutLoses: isShootout
            }
        }, {
            new: true
        }, (err, data) => {
            if (err) return handleError(err);
            Team.findOneAndUpdate({
                    'team': game.homeTeam,
                    'otherTeams.team': game.guestTeam
                }, {
                    $inc: {
                        'otherTeams.$.gamesPlayed': 1,
                        'otherTeams.$.wins': 1,
                        'otherTeams.$.guestWins': 1,
                        'otherTeams.$.goalsFor': parseInt(game.guestGoals),
                        'otherTeams.$.goalsAgainst': parseInt(game.homeGoals),
                        'otherTeams.$.shotsFor': parseInt(game.guestShots),
                        'otherTeams.$.shotsAgainst': parseInt(game.homeShots),
                        'otherTeams.$.overtimes': isOvertime,
                        'otherTeams.$.overtimeLoses': gameEndedDuringOvertime,
                        'otherTeams.$.shootouts': isShootout,
                        'otherTeams.$.shootoutLoses': isShootout
                    }
                },
                (err, result) => {
                    if (!err) {
                        console.log('resulttii')
                        console.log(result);
                    } else {
                        console.log('vituks män');
                        console.log(err);
                    }
                });
        });
    },

    addNewTeam: (data, io, res) => {
        // Declaring missing values from schema
        data.gamesPlayed = 0;
        data.wins = 0;
        data.loses = 0;
        data.goalsFor = 0;
        data.goalsAgainst = 0;
        data.shotsFor = 0;
        data.shotsAgainst = 0;
        data.overtimes = 0;
        data.overtimeWins = 0;
        data.overtimeLoses = 0;
        data.shootouts = 0;
        data.shootoutWins = 0;
        data.shootoutLoses = 0;
        data.homeWins = 0;
        data.homeLoses = 0;
        data.guestWins = 0;
        data.guestLoses = 0;
        data.otherTeams = [];

        // NEw team is added to db

        const newteam = new Team(data);
        newteam.save((err) => {
            if (err) {
                console.log(err);
                console.log('new team could\'t be saved itno the db');
                res.send(err);
            } else {

                // New data is sent to client side for real-time updating 
                io.sockets.emit('newteam', data);

                // Deleting unecessary properties as new team is added to every existing team collection...
                // ... which allows comparison between two teams
                delete data.otherTeams;
                delete data.teamChar;

                const conditions = {
                        'team': {
                            '$ne': data.team
                        }
                    },
                    update = {
                        $push: {
                            otherTeams: data
                        }
                    },
                    options = {
                        multi: true
                    };

                // All the teams except the new are updated with the new team data
                Team.update(conditions, update, options, (err, numAffected) => {
                    if (err) {
                        console.log(err);
                        console.log('error while trying to update old teams with new one');
                        res.send(err);
                    } else {
                        Team.find({}, '-otherTeams -teamChar -_id -__v').exec().then((teams) => {
                            if (teams.length <= 1) {
                                console.log('no teams added yet');
                                res.sendStatus(204);
                            } else {
                                // All the exiting teams are added to the new one with initilized values
                                let newTeamForSocket;
                                let index = 0;
                                for (let team of teams) {
                                    console.log(teams.length);

                                    if (data.team != team.team) {
                                        team.gamesPlayed = 0;
                                        team.wins = 0;
                                        team.loses = 0;
                                        team.goalsFor = 0;
                                        team.goalsAgainst = 0;
                                        team.shotsFor = 0;
                                        team.shotsAgainst = 0;
                                        team.overtimes = 0;
                                        team.overtimeWins = 0;
                                        team.overtimeLoses = 0;
                                        team.shootouts = 0;
                                        team.shootoutWins = 0;
                                        team.shootoutLoses = 0;
                                        team.homeWins = 0;
                                        team.homeLoses = 0;
                                        team.guestWins = 0;
                                        team.guestLoses = 0;
                                        Team.findOneAndUpdate({
                                            'team': data.team
                                        }, {
                                            $push: {
                                                otherTeams: team
                                            }
                                        }, {
                                            new: true
                                        }, (err, data) => {
                                            if (err) {
                                                console.log(err);
                                                console.log('error while trying to update new team with old one');
                                                console.log('team causing error ' + team);
                                                res.send(err);
                                            } else {
                                                console.log('old team added to new team');

                                                index++
                                                if (index === teams.length - 1) {
                                                    newTeamForSocket = data;

                                                    // New data is sent to client side for real-time updating 
                                                    io.sockets.emit('newteam', newTeamForSocket);
                                                }
                                            }
                                        });
                                    }
                                }
                                console.log('testtt');
                                console.log(newTeamForSocket);
                                res.sendStatus(204);
                            }
                        });
                    }
                });
            }
        });
    }
}