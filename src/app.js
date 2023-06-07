import express from 'express';
import __dirname from './utils.js';
import sessionsRouter from './routes/sessions.router.js'
import viewsRouter from './routes/views.router.js';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import session from 'express-session';
import initializePassport from './config/passport.config.js';
import passport from 'passport';

const app = express();

try {
    await mongoose.connect('mongodb+srv://diegosepu:2hQM9Rr3XUvfbwMs@cluster1ds.czhv5gd.mongodb.net/?retryWrites=true&w=majority');
    console.log('DB CONNECTED')
} catch (error) {
    console.log(error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.use(session({
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 3600
    }),
    secret: 'BackendDiego',
    resave: true,
    saveUninitialized: true
}));

//PASSPORT
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);

app.listen(8080);