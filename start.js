var chalk = require('chalk');
var commander = require('commander');
var express = require('express');
var person = require('./person');

var app = express();

var datastore = require('nedb');
var db = new datastore({ filename: 'db', autoload: true });

db.insert(new person(1, "test", 2016, null, null));
db.insert(new person(2, "test2", 2016, [1], null));

var host = "127.0.0.1";
var port = 5555;

app.get('/api/name/:name', function (req, res) {
    res.set('Content-Type', 'application/json');

    db.find({ name: req.params.name }, function (err, result) {
        res.send(JSON.stringify(result));

        if (err != null) {
                return {"err": "something goofed (name)"};
        }
    });
});

app.get('/api/id/:id', function (req, res) {
    res.set('Content-Type', 'application/json');

    db.find({ _id: req.params.id }, function (err, result) {
        res.send(JSON.stringify(result));

        if (err != null) {
                return {"err": "something goofed (id)"};
        }
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
