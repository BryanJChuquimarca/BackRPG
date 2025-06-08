"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
var pg_1 = require("pg");
/*const pool = new Pool({
  user: 'postgres',
  password: '0645',
  host: 'localhost',
  port: 5432,
  database: 'rpg'
});*/
var pool = new pg_1.Pool({
    user: 'rpg_k2sp_user',
    password: 'rhcBHmkOdA5JbIPSziUvIWMMQKxv6MXw',
    host: 'dpg-d12tkh49c44c738n351g-a',
    port: 5432,
    database: 'rpg_k2sp'
});
function query(text) {
    return pool.query(text);
}
exports.query = query;
;
