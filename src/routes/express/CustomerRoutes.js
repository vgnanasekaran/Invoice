'use strict';
const customerController = require('../../controllers/CustomerController');

module.exports = function(app) {
     app.get('/api/customers', function(req, res) {
          customerController.getCustomers(req, res, function(err, data) {
               if (!err) {
				console.log('CustomerRoutes - getCustomers - data - ', data);
				res.status(200).json(data);
			} else {
                    console.log('CustomerRoutes - getCustomers - err - ', err);
				res.status(500).json(err);
			}
          })

     });
}
