'use strict';
const model = require('../models/ProductModel');

export function getProductByDescription(description, next) {
     console.log('ProductController - getProductByDescription - description', description);
     model.getProductByDescription(description, function (err, data) {
        next(err, data);
    });
}
