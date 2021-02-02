var mysql = require('mysql2')
var psProxy = require('planetscale-proxy')
const schema = `
CREATE TABLE IF NOT EXISTS notes (
id bigint unsigned NOT NULL AUTO_INCREMENT, 
title varchar(255) NOT NULL, 
body text NOT NULL, 
created_by varchar(255) NOT NULL, 
updated_at datetime(6) NOT NULL default current_timestamp(6) on update current_timestamp(6), 
PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;`


exports.startDB = function(branch) {
    psProxy.startProxy(branch)
    var dbPass = psProxy.dbPass(branch)
    return dbPass
}

exports.startAndMigrate = function(branch) {
    psProxy.startProxy(branch)
    var dbPass = psProxy.dbPass(branch)
    var db = process.env.PSDB_DB_NAME.split('/')
    var conn = mysql.createConnection({
        host: 'localhost',
        port: 3307,
        user: 'root',
        password: dbPass,
        database: db[1],
        })
    migrateRetry(conn, 5, 1000, function(err) {
        if (err != null) {
            console.log('Failed to connect/migrate DB', err)
            //todo(nick): we should raise an error here? 
        }
    })
    return dbPass
}

exports.pool = function(dbPass) {
    var db = process.env.PSDB_DB_NAME.split('/')
    var pool = mysql.createPool({
        host: 'localhost',
        port: 3307,
        user: 'root',
        password: dbPass,
        database: db[1],
    })
    return pool
}

function migrateRetry(db, retryTimes, retryDelay, callback) {
    var cntr = 0;

    function run() {
        // try your async operation
        db.execute(schema, function(err, _, _) {
            ++cntr;
            if (err && err.errno != 1050) {
                if (cntr >= retryTimes) {
                    // if it fails too many times, just send the error out
                    callback(err);
                } else {
                    // try again after a delay
                    setTimeout(run, retryDelay);
                }
            } else {
                // success, send the data out
                callback(null);
            }
        });
    }
    // start our first request
    run();
}
