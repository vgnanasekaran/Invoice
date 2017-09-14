'use strict';
const invoiceController = require('../../controllers/InvoiceController');
const httpStatusCodes = require('http-status-codes');

module.exports = function(app) {
     app.get('/api/invoice/:invoiceId', function(req, res) {
          invoiceController.getInvoiceDetailById(req, res, function(err, data) {
               if (!err) {
				console.log('InvoiceRoutes - getInvoiceDetailById - data - ', data);
				res.status(httpStatusCodes.OK).json(data);
			} else {
                    console.log('InvoiceRoutes - getInvoiceDetailById - err - ', err);
                    let errCode = err.code;
                    if (! errCode) {
                         errCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
                    }
				res.status(errCode).json(err.message);
			}
          });
     });

     app.post('/api/invoice/', function(req, res) {
          invoiceController.createInvoice(req, res, function(err, data) {
               if (!err) {
				console.log('InvoiceRoutes - createInvoice - data - ', data);
				res.status(httpStatusCodes.OK).json(data);
			} else {
                    console.log('InvoiceRoutes - createInvoice - err - ', err);
                    let errCode = err.http_code;
                    console.log('InvoiceRoutes - errCode - ', errCode);
                    if (!errCode) {
                         errCode = httpStatusCodes.INTERNAL_SERVER_ERROR;;
                    }
				res.status(errCode).json(err.message);
			}
          });
     });

}
