var chalk = require('chalk');
var commander = require('commander');
var express = require('express');

var api = require('./api');
var app = express();

var address = "127.0.0.1";
var port = 5555;

app.get('/api/:id', function (req, res) {
        var result = api.getDataById(req.params.id);
        console.log(typeof result);
        console.log(JSON.stringify(result));
});

app.listen(port, address, function () {
        console.log('started');
});
