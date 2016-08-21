var chalk = require('chalk');
var commander = require('commander');
var express = require('express');
var person = require('./person');

var app = express();

var datastore = require('nedb');
var db = new datastore({ filename: 'db', autoload: true });

var host = "127.0.0.1";
var port = 5555;

function addBishop(parent, newBishop) {
    if (parent != null) {
        db.find({"name": parent}, function (e, par) {
            newBishop.conBishops.push(par[0]._id);
        });

        db.insert(newBishop, function (err, doc) {
            db.update({"name": parent}, { $push: {"consecrated": doc._id}});
        });
    } else {
        db.insert(newBishop);
    }
}


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

app.get('/api/year/:year', function (req, res) {
    res.set('Content-Type', 'application/json');

    db.find({ year: req.params.year }, function (err, result) {
        res.send(JSON.stringify(result));

        if (err != null) {
            return {"err": "something goofed (year)"};
        }
    });
});

app.get('/api/con/:name', function (req, res) {
    res.set('Content-Type', 'application/json');

    db.find({ name: req.params.name }, function (err, result) {
        res.send(JSON.stringify({ consecrated: result[0].consecrated, conBishops: result[0].conBishops }));
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
