var datastore = require('nedb');
var db = new datastore({ filename: 'db', autoload: true });

db.insert({ _id: '1', name: 'test' });
db.insert({ _id: '2', name: 'test' });

exports.getDataByName = function(n) {
        var result = db.get('persons').find({name: n}).value();
        return result;
}

exports.getDataById = function(id) {
        db.find({ _id: id }, function (err, res) {
                console.log(res);
        });
}
