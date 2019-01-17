const express = require('express');
const hbs = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mySQLsession = require('express-mysql-session');
const {db} = require('../keys');
const passport = require('passport');


//init's
 
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 4000); //puerto 
app.set('views',path.join(__dirname,'views')); //vistas
app.engine('.hbs',hbs({
    defaultLayout : 'main',
    layoutsDir : path.join(app.get('views'),'layouts'),
    partialsDir : path.join(app.get('views'),'partials'),
    extname : '.hbs',
    helpers : require ('./lib/handlebars')
})); // usar handle bars

app.set('view engine', '.hbs');
//... end settings
 
//middle-ware
app.use(session({
    secret : 'xyz',
    resave : false,
    saveUninitialized : false,
    store : new mySQLsession(db) 
}));

app.use(flash());
app.use(morgan('dev')); 
app.use(express.urlencoded({extended : false}));
app.use(express.json() );

app.use(passport.initialize());
app.use(passport.session());

//... end middle-ware
//global variables
app.use((req,res,next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.errores = req.flash('errores');

    app.locals.user = req.user;
    next();
});

//... end global v

//routes
app.use(require('./routes'));
app.use(require('./routes/authentications'));
app.use('/links',require('./routes/links'));



//public
app.use(express.static(path.join(__dirname,'public')));
//... end public

//start
app.listen(app.get('port'), () => {
    let port = app.get('port');
    console.log('server on port  '+port);
    
});

