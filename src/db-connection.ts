import { Pool } from 'pg';

const pool = new Pool({
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

export function query(text: any): any {
  return pool.query(text);
};