const session = require('express-session');
const mongoose = require('../libs/mongoose');
const MongoStore = require('connect-mongo')(session);

let sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

module.exports = sessionStore;