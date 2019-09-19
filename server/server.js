/**
* This is the server file for {{app_name}}
* @author {{app_author}}
* @since {{app_date}}
*/
import express from 'express';
import busboyBodyParser from 'busboy-body-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import flash from 'connect-flash';
import passport from 'passport';
import cors from 'cors';
import { LogServices } from 'appknit-backend-bundle';
import { secretString } from './constants';
import ActivateRoutes from './routes';

const app = express();

// enable cors support
app.use(cors({
	origin: '*',
	methods: ['GET', 'POST'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-HTTP-Method-Override', 'Accept'],
	credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboyBodyParser());
app.use(LogServices.RequestInterceptor);
if (process.env.NODE_ENV !== 'production') {
	app.use(LogServices.ResponseInterceptor);
}
app.use(morgan('dev'));
app.use(express.static(path.resolve('dist')));
app.use(session({ secret: secretString, resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(flash());

// call this to activate routes or define inside the route directory
ActivateRoutes(app);

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
app.get('/', (req, res) => res.send(`<h1>{{app_name}} ${env} environment</h1>`));

const port = process.env.NODE_ENV === 'development' ? 3000 : 3001;

app.listen(port, () => console.log(`Backend is running on port ${port}`));
