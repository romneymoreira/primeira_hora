var mysql = require("mysql");

var connMysql = function() {
    return mysql.createConnection({
        host: "localhost",
        user: "romney",
        password: "123456",
        database: "jornal"
    });
}

module.exports = function() {
    return connMysql;
};