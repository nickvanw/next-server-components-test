const db = require('./db')
dbPass = db.startDB('test')

module.exports = db.pool(dbPass);
