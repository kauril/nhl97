const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
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

// create the model for users and expose it to our app
module.exports = mongoose.model('Game', gameSchema);