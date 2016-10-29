var chalk = require('chalk');
var commander = require('commander');
var express = require('express');
var fetch = require('node-fetch');
var hbs = require('hbs');

var api = require('./api');

var app = express();

// settings
var host = "127.0.0.1";
var port = 5555;

app.use('/api', api); // make sure the api routes are hooked up and working at /api

// ensure that handlebars is the view engine on express' end
app.set('view engine', 'hbs');
app.set('views', __dirname + '/v');
hbs.registerPartials(__dirname + '/v/part');

// load the assets into their proper folder so the templates run smoothly
app.use('/js',express.static(__dirname + '/assets/js'));
app.use('/css',express.static(__dirname + '/assets/css'));

// frontend routes
/*
        app.get('/profile/:id', function (req, res) {
            fetch("http://" + host + ":" + port + "/api/id/" + req.params.id)
            .then(r => r.json()).then(json => {
                    json.pagename = "Profile";
                    res.render('profile', json);
            });
        });
*/

app.get('/signup', function (req, res) {
    res.render('signup', {pagename: "Sign up"});
})

// handle CLI arguments, and respond accordingly
commander.version('1.0.0')
         .option('-h, --host', 'set hostname [default: 127.0.0.1]')
         .option('-p, --port', 'set port [default: 5555]')
         .parse(process.argv);

if (commander.host) {
    host = commander.host;
}

if (commander.port) {
    port = commander.port;
}

// houston, we have lift off
app.listen(port, host, function () {
    console.log(chalk.bold.cyan('Server started on ' +
                                chalk.bold.green(host + ':' + port) + '.'));
});
