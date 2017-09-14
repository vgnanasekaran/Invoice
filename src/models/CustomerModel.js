'use strict';
const pool = require('./mysqldb').pool;
const httpStatusCodes = require('http-status-codes');



export function getCustomers(offset, limit, contrlrCallback) {
     console.log('CustomerModel - getCustomers - offset ', offset);
     console.log('CustomerModel - getCustomers - limit ', limit);

     pool.getConnection(function (poolErr, connection) {
		if (poolErr) {
			return contrlrCallback(poolErr, null);
		}
          console.log("CustomerModel - getCustomers free connections: " + pool._freeConnections.length);
          console.log("InvoiceModel - getCustomers - all connections: " + pool._allConnections.length);
          const query = "SELECT * FROM customer LIMIT ? OFFSET ?";
          connection.query(query, [limit, offset], function(err, rows, fields) {
               connection.release();
               if (err) {
                    return contrlrCallback(err, null);
               } else {
                    console.log('CustomerModel - getCustomers - rows', rows);
                    return contrlrCallback(null, rows);
               }
          });
     });
}

export function getCustomerByEmail(email, contrlrCallback) {
     console.log('CustomerModel - getCustomerByEmail - email - ', email);
     pool.getConnection(function (poolErr, connection) {
		if (poolErr) {
			return contrlrCallback(poolErr, null);
		}
          console.log("CustomerModel - getCustomers free connections: " + pool._freeConnections.length);
          console.log("InvoiceModel - getCustomers - all connections: " + pool._allConnections.length);
          const query = "SELECT * FROM customer WHERE email= ?";
          connection.query(query, [email], function(err, rows, fields) {
               connection.release();
               if (err) {
                    return contrlrCallback(err, null);
               } else {
                    console.log('CustomerModel - getCustomerByEmail - rows', rows);
                    if (rows.length == 0) {
                         const err = new Error('Customer Does Not Exist');
                         err.code = httpStatusCodes.NOT_FOUND;
                         return contrlrCallback(err, null);
                    } else {
                         const stringData = JSON.stringify(rows);
                         return contrlrCallback(null, JSON.parse(stringData));
                    }
               }
          });
     });
}
