var datastore = require('nedb');
var db = new datastore({ filename: 'db', autoload: true });

db.insert({ _id: '1', name: 'test' });
db.insert({ _id: '2', name: 'test' });

exports.getDataByName = function(n) {
        db.find({ name: n }, function (err, res) {
                if (err == null) {
                         return res;
                } else {
                        console.log("[err] error in getDataByName() - ", err);
                }
        });
}

exports.getDataById = function(id) {
        db.find({ _id: id }, function (err, res) {
                if (err == null) {
                        //console.log("balshdl", JSON.stringify(res));
                        return res;
                } else {
                        console.log("[err] error in getDataById() - ", err);
                }
        });
}
