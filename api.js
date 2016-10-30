var express = require('express');
var router = express.Router();
var sha512 = require('js-sha512').sha512;
var bodyParser = require('body-parser');
var validator = require('validator');
var crypto = require('crypto');

var profanity = require('profanity-util');

var datastore = require('nedb');
var db = new datastore({ filename: 'db', autoload: true });

// import environment variables (do not uncomment this unless the variables are set)
/*
    var captchaSecret = process.env.CAPTCHA_SECRET;
    var captchaSiteKey = process.env.CAPTCHA_SITE;
    var apiKey = process.env.API_KEY;

    // check if the api key is valid, otherwise deny ANY functionality
    if (sha512(apiKey + '') != "0b8d819370a076884785850fdb5278b17558b8f83efa7f989f5ccbc75e937e81ded485c1f5538e353daeef12727371228e370f4fe5628c431b4210e472ed2ca1") {
       return { error: 401, text: "you shall not use this api" };
    }
*/

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// backend functions
function isReserved(username) {
    // pretty self explanitory, checks if the username is reserved
    // returns: boolean
    var reservedUsernames = [ "evildea", "zamenhof", "admin", "owner", "staff", "team",
                              "vypr", "itwango", "stupiddroid", "moderator", "amuzulo",
                              "mod", "administrator", "support" ];

    // development usage only
    if (username.includes("test") || username.includes("retejo")) {
        return true;
    }

    // profanity checks
    if (profanity.check(username).length != 0) {
        return true;
    }

    if (username.includes("fuck") || username.includes("fag") || username.includes("nig")) {
        return true;
    }

    // check if the username is one of the prereserved names
    for (var i = 0; i < reservedUsernames.length; i++) {
        if (username == reservedUsernames[i]) {
            return true;
        }
    }

    return false;
}

function databaseInsert(username, password, email, joinDate, salt) {
    // inserts the data into the database, no kidding, right?
    // returns: boolean

    // create a json object based on the values
    var data = {"username": username, "password": password, "email": email, "joinDate": joinDate, "salt": salt};

    db.insert(data, function (err, newDocument) {
        if (err != null) {
            return false;
        }
    });

    return true;
}

// routes
router.post('/signup', function (req, res) {
    var data = req.body;

    // makes sure that they match, so that way people don't mess up accidentally
    if (data.password != data.confirmpass) { res.send("passwords don't match"); return; }
    if (data.email != data.confirmemail) { res.send("emails don't match"); return; }

    // escape every input, hash the password (with a random salt), and create a join date
    var salt = crypto.randomBytes(16).toString("hex");

    var username = validator.validate(data.username);
    var password = sha512(validator.validate(data.password) + salt);
    var email = validator.normalizeEmail(data.email);
    var joinDateObject = new Date();
    var joinDate = joinDateObject.getTime();

    // checks the database if the email and/or the username already exists
    db.find({$or: [{ "username": username }, { "email": email }]}, function (err, docs) {
        // if cases handling what happens as a result of the data;
        if (isReserved(username)) {
            res.send("this username is reserved or not allowed, please contact team@retejo.me for more information");
        } else if (docs.length != 0) {
            usernameOrEmail = (username === docs[0].username ? 'username' : 'email');
            res.send("this " + usernameOrEmail + " already exists in our database, please contact support if you need to recover your account");
        } else if (username.indexOf(' ') >= 0) {
            res.send("your username cannot contain whitespace, sorry!");
        } else if (validator.isEmail(email)) {
            res.send("please insert a valid email");
        } else {
            if (!databaseInsert(username, password, email, joinDate, salt)) {
                res.send("for some reason, we failed to create your account. please contact support if this persists: " + joinDate.toString());
            } else {
                res.send("account created successfully, you may now log in");
            }
        }
    });
});

router.post('/login', function (req, res) {
    var data = req.body;

    var username = validator.escape(data.username);

    db.find({ "username": username }, function (err, docs) {
        if (docs.length != 0) {
            var queryResult = docs[0];
            var password = sha512(validator.escape(data.password) + queryResult.salt);

            if (password != queryResult.password) {
                res.send("invalid password. please contact support if you need to recover your account");
            } else {
                // TODO: Create Session
            }
        } else {
            res.send("username not found");
        }
    });
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
