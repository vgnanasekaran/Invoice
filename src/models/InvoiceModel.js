'use strict';
const pool = require('./mysqldb').pool;
const async = require('async');
const utils = require('../common/Utils');
const moment = require('moment');


export function getInvoiceDetailById(invoiceId, contrlrCallback) {
     console.log('InvoiceModel - getInvoiceDetailById - invoiceId', invoiceId);
     pool.getConnection(function (poolErr, connection) {
		if (poolErr) {
			return contrlrCallback(poolErr, null);
		}
          console.log("InvoiceModel - getInvoiceDetailById - free connections : " + pool._freeConnections.length);
          console.log("InvoiceModel - getInvoiceDetailById - all connections : " + pool._allConnections.length);

          const query = "SELECT * FROM invoice WHERE id = ?";
          connection.query(query, [invoiceId], function(err, rows, fields) {
               connection.release();
               if (err) {
                    return contrlrCallback(err, null);
               } else {
                    console.log('InvoiceModel - getInvoiceDetailById - rows', rows);
                    return contrlrCallback(null, rows);
               }
          });
     });
}

export function createInvoice(invoice, contrlrCallback) {
     console.log('InvoiceModel - createInvoice');
     const invoiceLineItems = invoice.line_items;
     const customerId = invoice.customer.id;
     pool.getConnection(function (poolErr, connection) {
		if (poolErr) {
			return contrlrCallback(poolErr, null);
		}
          console.log("InvoiceModel - createInvoice - free connections : " + pool._freeConnections.length);
          console.log("InvoiceModel - createInvoice - all connections : " + pool._allConnections.length);
          connection.beginTransaction( function (transErr) {
               if (transErr) {
				return contrlrCallback(transErr, null);
			}
               const due_date = moment(invoice.due_date, 'MM/DD/YYYY').format('YYYY-MM-DD');
               const query = "INSERT INTO invoice(customer_id, due_date) VALUES(?, ?) ";
               connection.query(query, [customerId, due_date], function(err, rows) {
                    if (err) {
                         connection.rollback(function () {
                              connection.release();
                              return contrlrCallback(err, null);
                         });
                    } else {
                         let data = {};
					console.log('createInvoice : ', rows);
					const stringData = JSON.stringify(rows);
					data = JSON.parse(stringData);
                         const invoiceId = data.insertId;
                         const itemQuery = "Insert INTO invoice_line_item(invoice_id, product_id, unit_price, currency, qty) VALUES (?, ?, ?, ?, ?)"
                         async.each(invoiceLineItems, function (item, callback) {
                              console.log('InvoiceModel - createInvoice - item ', item);
                              const unit_price = utils.convertToLowestDenomination(item.unit_price);
                              connection.query(itemQuery, [invoiceId, item.id, unit_price, item.currency, item.qty], function(err, row) {
                                   console.log('InvoiceModel - createInvoice - err', err);
                                   console.log('InvoiceModel - createInvoice - row', row);
                                   callback(err, row);
                              });
                         }, function(itemErr) {
                              if(itemErr) {
                                   connection.rollback(function (err) {
                                        connection.release();
                                        console.log("InvoiceModel - createInvoice - rollback - free connections : " + pool._freeConnections.length);
                                        console.log("InvoiceModel - createInvoice - rollback - all connections : " + pool._allConnections.length);
                                        return contrlrCallback(itemErr, null);
                                   });
                              } else  {
                                   connection.commit(function (err) {
                                        connection.release();
                                        console.log("InvoiceModel - createInvoice - commit - free connections : " + pool._freeConnections.length);
                                        console.log("InvoiceModel - createInvoice - commit - all connections : " + pool._allConnections.length);
                                        invoice.id = data.insertId;
                                        return contrlrCallback(err, { invoice: invoice});
                                   });
                              }
                         });
                    }
               });
          });
     });
}
