var express = require('express');
var router = express.Router();
var sha512 = require('js-sha512').sha512;
var bodyParser = require('body-parser');
var sanitizer = require('sanitizer');
var crypto = require('crypto');

var datastore = require('nedb');
var db = new datastore({ filename: 'db', autoload: true });

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// backend functions
function checkIfExists(user, mail) {
    // checks the database for any existing emails or usernames
    // returns: boolean

    db.find({ username: user }, function (err, docs) {
        if (docs.length != 0) {
            return "username";
        }
    });

    db.find({ email: mail }, function (err, docs) {
        console.log(docs.length);
        if (docs.length != 0) {
            return "email";
        }
    });
}

function isReserved(username) {
    // pretty self explanitory, checks if the username is reserved
    // returns: boolean
    var reservedUsernames = [ "evildea", "zamenhof", "admin", "owner", "staff", "team", "vypr", "itwango", "stupiddroid", "moderator", "amuzulo"];

    for (var i = 0; i < reservedUsernames.length; i++) {
        if (username == reservedUsernames[i]) {
            return true;
        }
    }

    return false;
}

function databaseInsert(username, password, email, joinDate) {
    // inserts the data into the database, no kidding, right?
    // returns: boolean

    // create a json object based on the values
    var data = {"username": username, "password": password, "email": email, "joinDate": joinDate};
    var result = true;

    db.insert(data, function (err, newDocument) {
        if (err != null) {
            console.log(err);
            result = false;
        }
    });
    return result;
}

// routes
router.post('/signup', function (req, res) {
        var data = req.body;

        // makes sure that they match, so that way people don't mess up accidentally
        if (data.password != data.confirmpass) { res.send("passwords don't match"); return; }
        if (data.email != data.confirmemail) { res.send("emails don't match"); return; }

        // escape every input, hash the password (with a random salt), and create a join date
        var username = sanitizer.escape(data.username);
        var password = sha512(sanitizer.escape(data.password) + crypto.randomBytes(16).toString("hex"));
        var email = sanitizer.escape(data.email);
        var joinDateObject = new Date();
        var joinDate = joinDateObject.getTime();

        // checks the database if the email and/or the username already exists
        var existenceStatus = checkIfExists(username, email);

        // if cases handling what happens as a result of the data;
        if (isReserved(username)) {
            res.send("this username is reserved, please contact team@retejo.me for more information");
        } else if (existenceStatus) {
            res.send("this " + existenceStatus + " already exists in our database, please contact team@retejo.me if you need to recover your account");
        } else {
            if (!databaseInsert(username, password, email, joinDate)) {
                res.send("for some reason, we failed to create your account. send this to team@retejo.me if this persists: " + joinDate.toString());
            } else {
                res.send("account created successfully, you may now log in");
            }
        }
});

router.get('/id/:id', function (req, res) {
    // an api call for pulling the data of the user, will be used later, ignore for now
    res.set('Content-Type', 'application/json');

    db.find({ _id: req.params.id }, function (err, result) {
        res.send(JSON.stringify(result[0]));

        if (err != null) {
            return {"err": "something goofed (id)"};
        }
    });
});

module.exports = router;
