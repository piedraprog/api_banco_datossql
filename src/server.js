//CONFIG OF SERVER
import 'module-alias/register';
import express from 'express';
import { morganMiddleware } from '@morgan';
import cors from 'cors';
import ListRoutes from '@routes/list.routes';
import config from '@config';
import { logger }  from '@logger';
import './database';

const app = express();

//SETTINGS
app.set('port', config.port);

// //MIDDLEWARE
const corsOptions = {};
app.use(cors(corsOptions));

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// //GENERAL
app.get('/', (req, res) => {
	res.send('valido');
});


// //FUNCTIONAL ROUTES
app.use('/api', ListRoutes);

// eslint-disable-next-line no-unused-vars
app.use((req,res,next)=>{
	res.status(404).json({
		message:'endpoint not fount'
	});

});

app.listen(app.get('port'));
logger.info({message:`server on port, ${app.get('port')}`, file: 'index.js'}); 