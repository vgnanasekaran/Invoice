'use strict';
const pool = require('./mysqldb').pool;
const httpStatusCodes = require('http-status-codes');

export function getProductByDescription(description, contrlrCallback) {
     console.log('ProductModel - getProductByDescription - description - ', description);
     pool.getConnection(function (poolErr, connection) {
		if (poolErr) {
			return contrlrCallback(poolErr, null);
		}
          console.log("ProductModel - getProductByDescription free connections: " + pool._freeConnections.length);
          console.log("ProductModel - getProductByDescription - all connections: " + pool._allConnections.length);
          const query = "SELECT * FROM product WHERE description = ?";
          connection.query(query, [description], function(err, rows, fields) {
               connection.release();
               if (err) {
                    return contrlrCallback(err, null);
               } else {
                    console.log('ProductModel - getProductByDescription - rows', rows);
                    if (rows.length == 0) {
                         const err = new Error('Product ' +  description + ' Does Not Exist');
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
