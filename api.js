var express = require('express');
var router = express.Router();
var person = require('./person');

var datastore = require('nedb');
var db = new datastore({ filename: 'db', autoload: true });

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

// TODO: make api call where bishops can be added

router.get('/name/:name', function (req, res) {
    res.set('Content-Type', 'application/json');

    db.find({ name: req.params.name }, function (err, result) {
        res.send(JSON.stringify(result));

        if (err != null) {
            return {"err": "something goofed (name)"};
        }
    });
});

router.get('/id/:id', function (req, res) {
    res.set('Content-Type', 'application/json');

    db.find({ _id: req.params.id }, function (err, result) {
        res.send(JSON.stringify(result));

        if (err != null) {
            return {"err": "something goofed (id)"};
        }
    });
});

router.get('/year/:year', function (req, res) {
    res.set('Content-Type', 'application/json');

    db.find({ conDate: req.params.year }, function (err, result) {
        res.send(JSON.stringify(result));

        if (err != null) {
            return {"err": "something goofed (year)"};
        }
    });
});

router.get('/con/:name', function (req, res) {
    res.set('Content-Type', 'application/json');

    db.find({ name: req.params.name }, function (err, result) {
        res.send(JSON.stringify({ consecrated: result[0].consecrated, conBishops: result[0].conBishops }));
    });
});

module.exports = router;
