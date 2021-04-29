var PSDB = require('psdb-node')
const _schema = `
CREATE TABLE IF NOT EXISTS notes (
id bigint unsigned NOT NULL AUTO_INCREMENT, 
title varchar(255) NOT NULL, 
body text NOT NULL, 
created_by varchar(255) NOT NULL, 
updated_at datetime(6) NOT NULL default current_timestamp(6) on update current_timestamp(6), 
PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;`



module.exports = new PSDB('test')
