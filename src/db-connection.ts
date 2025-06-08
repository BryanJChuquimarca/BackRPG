import { Pool } from 'pg';

/*const pool = new Pool({
  user: 'postgres',
  password: '0645',
  host: 'localhost',
  port: 5432,
  database: 'rpg'
});*/

const pool = new Pool({
  user: 'rpg_k2sp_user',
  password: 'rhcBHmkOdA5JbIPSziUvIWMMQKxv6MXw',
  host: 'dpg-d12tkh49c44c738n351g-a',
  port: 5432,
  database: 'rpg_k2sp'
});

export function query(text: any): any {
  return pool.query(text);
};