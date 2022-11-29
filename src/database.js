import { createPool } from 'mysql2/promise';
import config from './config';


export const pool = createPool({
	host: config.mysqlHost,
	user: config.mysqlUser,
	password: config.mysqlPass,
	port: config.mysqlPort,
	database: config.mysqlDb
});
