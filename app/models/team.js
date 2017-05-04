const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
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
    },
    otherTeams: []
    
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Team', teamSchema);