'use strict';
const model = require('../models/CustomerModel');


export function getCustomers(req, res, next) {
    console.log('InvoiceController - getInvoiceDetailById');
    const offset = req.params.offset || 0;
    const limit = req.params.limit || 1000;
    model.getCustomers(offset, limit, function (err, data) {
        next(err, data);
    });
}

export function getCustomerByEmail(req, res, next) {
     const email = req.body.invoice.customer.email;
     console.log('InvoiceController - getCustomerByEmail');
     model.getCustomerByEmail(email, function (err, data) {
        next(err, data);
    });
}
