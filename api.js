var express = require('express');
var router = express.Router();
var person = require('./person');
var sha512 = require('js-sha512').sha512;

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

router.post('/create/:pass/:data', function (req, res) {
        var auth = "2ebd8a256f5b5600343d1b73b9551292caf6a324cc9aeec5aa920c51818d3aeccd7d6084c17e142def5d4b1edde267a36854ce2bbbbcc2edfe229f27742d399a";
        if (req.params.pass == auth) {
            var parent = req.params.data.parent;
            delete req.params.data.parent;

            addBishop(parent, req.params.data);

            res.send("success");
        } else {
            res.send("authentication error");
        }

});

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
        res.send(JSON.stringify(result[0]));

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
