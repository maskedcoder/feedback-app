var joi = require('joi');
var express = require('express');

/**
 * Initialize the router
 *
 * @param {Object}  dataStore    An object that will be used as a database
 * @returns {Object}
 */
module.exports = function(dataStore) {
  var productData = dataStore.productData;
  var companyData = dataStore.companyData;

  // Schema for validating new products
  var productSchema = joi.object().unknown().keys({
    name: joi.string().regex(/^(\w|\s)*$/).min(3).max(30).required(),
    description: joi.string().min(15).required(),
    company: joi.number().integer()
  });

  var lastId = productData.length;
  var getNextId = function() {
    lastId++;
    return lastId;
  };

  router = express.Router();

  /**
   * Fetch a product by id when :id url param is given
   */
  router.param('product_id', function(req, res, next, id) {
      var i = 0;
      var len = productData.length;
      id = Number(id); // Route params are strings

      for (; i < len; i++) {
        if (productData[i].id === id) {
          req.product = productData[i];

          // Find the product's company
          for (i = 0, len = companyData.length; i < len; i++) {
            if (companyData[i].id === req.product.company) {
              req.company = companyData[i];
              return next();
            }
          }

          // The company was not found
          // Continue, but there might be an error
          return next();
        }
      }

      // No product has been found, so it must not exist
      res.status(404)
        .send('Product ' + id + ' not found');
    })

  router.route('/')

    /**
     * Get a list of all products
     *
     * GET /products
     */
    .get(function(req, res) {
      res.json(productData);
    })

    /**
     * Post a new product
     *
     * POST /products
     */
    .post(function(req, res) {
      var productCandidate = req.body;
      var newProduct = {};

      productCandidate.company = Number(productCandidate.company);

      joi.validate(productCandidate, productSchema, function(err, value) {
        if (err) {
          return res.status(400)
            .send('Invalid product data');
        }

        newProduct = {
          id: getNextId(),
          company: productCandidate.company,
          name: productCandidate.name,
          description: productCandidate.description
        };

        productData.push(newProduct);

        res.status(201)
          .json(newProduct);
      });
    });

  router.route('/:product_id')

    /**
     * Get a single product
     *
     * GET /products/##
     */
    .get(function(req, res) {
      // Copy the product so we can add data
      var product = JSON.parse(JSON.stringify(req.product));

      // Since we loaded the company, add it
      product.company = req.company;

      res.json(product);
    })

    /**
     * Delete a single product
     *
     * DELETE /products/##
     */
    .delete(function(req, res) {
      // oldLength and newLength are used to detect errors
      var oldLength = productData.length;
      var newLength = 0;
      var productId = req.product.id;

      // Use forEach instead of filter so the actual object is edited
      // (and thus the change exists for other route files as well)
      productData.forEach(function(item, index) {
        if (item.id === productId) {
          productData.splice(index, 1);
        }
      });

      delete req.product;

      newLength = productData.length;

      if (newLength === oldLength) {
        // Length did not change, so the product by that id did not exist
        res.sendStatus(404);
      } else if (newLength === oldLength - 1) {
        // Length is what we expected
        res.sendStatus(204);
      } else {
        // Length changed unexpectedly, so something is wrong
        res.sendStatus(500);
        console.error('Delete product #' + productId + ' resulted in bad data:');
        console.error('    Old data length: ' + oldLength);
        console.error('    New data length:' + newLength);
      }
    })

    /**
     * Update a single product
     *
     * PUT /products/##
     */
    .put(function(req, res) {
      var productCandidate = req.body;

      joi.validate(productCandidate, productSchema, function(err, value) {
        if (err) {
          return res.status(400)
            .send('Invalid product data');
        }

        req.product.name = productCandidate.name;
        req.product.company = productCandidate.company;
        req.product.description = productCandidate.description;

        res.json(req.product);
      });
    });

  return router;
};
