module.exports = {

    'url' : `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}` // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

};