"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
var pg_1 = require("pg");
var pool = new pg_1.Pool({
    user: 'postgres',
    password: '0645',
    host: 'localhost',
    port: 5432,
    database: 'rpg'
});
/*const pool = new Pool({
  user: 'smashorpass_user',
  password: 'Yc5qcU0BlOLMJqD2I227bXpNJsjo5Rbe',
  host: 'dpg-d08eu115pdvs739o9g30-a',
  port: 5432,
  database: 'smashorpass'
});*/
function query(text) {
    return pool.query(text);
}
exports.query = query;
;
