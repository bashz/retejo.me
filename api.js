var express = require('express');
var router = express.Router();
var person = require('./person');
var sha512 = require('js-sha512').sha512;
var bodyParser = require('body-parser');
var sanitizer = require('sanitizer');
var crypto = require('crypto');

var datastore = require('nedb');
var db = new datastore({ filename: 'db', autoload: true });

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// backend functions
function checkIfExists(username, email) {
    // ------ TODO ------
    // check if a username and/or email already exists in the database
    // returns: [boolean, "username" || "email" || "email and username" ]
}

function isReserved(username) {
    // ------ TODO ------
    // check if the username isn't already reserved by the Retejo Team
    // examples: "evildea", "admin", "owner", etc...
    // returns: boolean
}

function databaseInsert(username, password, email, joinDate) {
    // ------ TODO ------
    // inserts the data into the database, no kidding, right?
    // returns: boolean

    // var data = {"username": username, "password": password, "email": email, "joinDate": joinDate};
}

// routes
router.post('/signup', function (req, res) {
        var data = req.body;

        if (data.password != data.confirmpass) { res.send("passwords don't match"); return; }
        if (data.email != data.confirmemail) { res.send("emails don't match"); return; }

        var username = sanitizer.escape(data.username);
        var password = sha512(sanitizer.escape(data.password) + crypto.randomBytes(16).toString("hex"));
        var email = sanitizer.escape(data.email);
        var joinDateObject = new Date();
        var joinDate = joinDateObject.getTime();

        var existenceStatus = checkIfExists(username, email)[0];

        if (!isReserved(username)) {
            res.send("this username is reserved, please contact team@retejo.me for more information");
        } else if (existenceStatus[0]) {
            res.send("this " + existenceStatus[1] + " already exists in our database, please contact team@retejo.me if you need to recover your account");
        } else {
            if (!databaseInsert(username, password, email, joinDate)) {
                res.send("for some reason, we failed to create your account. send this to team@retejo.me if this persists: " + joinDate.toString());
            } else {
                res.send("account created successfully, you may now log in");
            }
        }
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

module.exports = router;
