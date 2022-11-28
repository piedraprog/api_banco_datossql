/* eslint-disable no-undef */
import { config } from 'dotenv';
config();


export default {
	baseUrl: process.env.APIURL || 'http://localhost:3000',
	env: process.env.ENVIRONMENT, 
	port: process.env.PORT,

	mysqlUser: process.env.MYSQLUSER,
	mysqlHost: process.env.MYSQLHOST,
	mysqlPass: process.env.MYSQLPASSWORD,
	mysqlDb: process.env.MYSQLDATABASE,
	mysqlPort: process.env.MYSQLPORT,
};
