const mysql = require('mysql');


module.exports = {
    createconnection: function (_host, _port, _user, _password, _database) {
        return mysql.createConnection({
            host: _host,
            port: _port,
            user: _user,
            password: _password,
            database: _database
        });
    },

    mysqlquery: function (db, sql) {
        return new Promise(function (resolve, reject) {
            db.query(sql, function (err, results, fields) {
                if (err) { console.log(err); throw err; }
                return resolve(results);
            });
        });
    }
    
}