'use strict';
const invModel = require('../models/InvoiceModel');
const customerController = require('./CustomerController');
const productController = require('./ProductController');
const async = require('async');
const httpStatusCodes = require('http-status-codes');

export function getInvoiceDetailById(req, res, next) {
    console.log('InvoiceController - getInvoiceDetailById');
    invModel.getInvoiceDetailById(req.params.invoiceId, function (err, data) {
        next(err, data);
    });
}

export function createInvoice(req, res, next) {
    console.log('InvoiceController - createInvoice - invoice - ', req.body.invoice);
    validateInvoice(req, res, function(err, invoice){
         if (err) {
              err.http_code = httpStatusCodes.BAD_REQUEST;
              return next(err, null);
         } else  {
          //     async.parallel({
          //          customer: function(callback) {
          //               getCustomerDetail(req, function(err, data) {
          //                    callback(err, data);
          //               });
          //          },
          //          line_items: function(callback) {
          //               getLineItems(req, function(err, data) {
          //                    callback(err, data);
          //               });
          //          },
          //     }, function (err, results) {
          //          console.log('result.line_items - ', results.line_items);
          //          invoice.line_items = results.line_items;
          //          invModel.createInvoice(results.customer, invoice, function(err, data){
          //               next(err, data);
          //          });
          //     });
               invModel.createInvoice(invoice, function(err, data){
                    next(err, data);
               });
         }
    });
}

function getCustomerDetail(req, cb) {
     const customer = req.body.invoice.customer;
     console.log('InvoiceController - getCustomerDetail - customer Id', customer.id);
     if (customer.id) {
          return cb(null, customer);
     }
}

function validateInvoice(req, res, cb) {
     const invoice = req.body.invoice;
     validateCustomer(req, res, function(err, custId) {
          if (err) {
               return cb(err, null);
          } else {
               invoice.customer.id = custId;
               validateLineItems(req, res, function(err, data){
                    invoice.line_items = data;
                    cb(err, invoice);
               });
          }
     });
}

function validateCustomer(req, res, cb) {
     const invoice = req.body.invoice;
     const customer = invoice.customer;
     if (!customer.id) {
          if (!customer || !customer.email) {
               return cb(new Error ('Customer Information Is Missing'));
          } else {
               customerController.getCustomerByEmail(req, res, function(err, data){
                    if (err) {
                         return cb(err, null);
                    } else {
                         return cb(null, data[0].id);
                    }
               });
          }
     } else {
          cb(null, invoice.customer.id);
     }
}

function validateLineItems(req, res, cb) {
     const lineItems = req.body.invoice.line_items;
     const lineItemsWithId = [];
     if (lineItems) {
          async.each(lineItems, function (item, callback) {
               if (item.id) {
                    lineItemsWithId.push(item);
                    callback(null, item);
               } else {
                    productController.getProductByDescription(item.description, function (err, data) {
                         if (err) {
                              callback(err, null);
                         } else {
                              item.id = data[0].id;
                              lineItemsWithId.push(item);
                              callback(null, item);
                         }
                    });
               }
          }, function (err) {
               if (!err) {
                    cb(null, lineItemsWithId);
               } else {
                    cb(err, null);
               }
          });
     }
}
