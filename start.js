var chalk = require('chalk');
var commander = require('commander');
var express = require('express');

var api = require('./api');

var app = express();

var host = "127.0.0.1";
var port = 5555;

app.use('/api', api);

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
