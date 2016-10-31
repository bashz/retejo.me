var chalk = require('chalk');
var commander = require('commander');
var express = require('express');
var fetch = require('node-fetch');
var hbs = require('hbs');

// session-related things
var session = require('express-session');
var sessionStore = require('express-nedb-session')(session);

var api = require('./api');

var app = express();

// the secret will be process.env.COOKIE_SECRET
// but for now, we're just gonna use a test one
app.use(session({
    secret: "bananasaregreat",
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 365 * 24 * 3600 * 1000 // a week long session
    },
    store: new sessionStore({ filename: 'sessiondb' })
}));

app.use('/api', api); // make sure the api routes are hooked up and working at /api

// ensure that handlebars is the view engine on express' end
app.set('view engine', 'hbs');
app.set('views', __dirname + '/v');
hbs.registerPartials(__dirname + '/v/part');

// load the assets into their proper folder so the templates run smoothly
app.use('/js',express.static(__dirname + '/assets/js'));
app.use('/css',express.static(__dirname + '/assets/css'));

// frontend routes

app.get('/', function (req, res) {
    var json = {};

    if (req.session.user) {
        json.name = req.session.user.username;
    } else {
        json.name = req.ip;
    }

    json.pagename = "home";
    res.render('home', json);
});

app.get('/login', function (req, res) {
    res.render('login', {pagename: 'Login'});
});

app.get('/signup', function (req, res) {
    res.render('signup', {pagename: "Sign up"});
});

module.exports = app;
