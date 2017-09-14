'use strict';
var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'sales'
});

console.log('pool created successfully');

exports.pool = pool;
