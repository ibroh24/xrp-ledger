var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "xrpproject"

});

connection.connect((err) => {
    if(err) throw err;
    console.log("Database connected...");
});

module.exports = connection;