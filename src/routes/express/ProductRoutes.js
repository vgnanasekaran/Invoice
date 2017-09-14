'use strict';

module.exports = function(app) {
     app.get('/api/product', function(req, res) {
      res.json({ message: 'Product API Initialized!'});
     });
}
