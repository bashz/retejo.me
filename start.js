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

app.use('/api', api);

app.set('view engine', 'hbs');
app.set('views', __dirname + '/v');
hbs.registerPartials(__dirname + '/v/part');

// frontend routes
app.get('/profile/:id', function (req, res) {
    fetch("http://" + host + ":" + port + "/api/id/" + req.params.id)
    .then(r => r.json()).then(json => {
            json.pagename = "Profile";
            res.render('profile', json);
    });
});

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

app.listen(port, host, function () {
    console.log(chalk.bold.cyan('Server started on ' +
                                chalk.bold.green(host + ':' + port) + '.'));
});
