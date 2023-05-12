const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.dbHOST,
    socketPath: process.env.dbSOCKET,
    user: process.env.dbUSER,
    password: process.env.dbPASSWORD,
    database: process.env.dbNAME,
    port: process.env.dbPORT,
});

//Подключение к БД
connection.connect(function(err) {
    if (err) {
      console.error('Error connecting: ' + err.stack);
      return;
   }
   console.log('Succesfully connected as id: ' + connection.threadId);
});

//connection.end();

module.exports = connection;