var joi = require('joi');

var productData = [
  {
    id: 1,
    company: 2,
    name: 'Foo Wax',
    description: 'Lorem Foo Wax dolor sit amet, consectetur adipisicing elit. Perspiciatis ullam consequuntur velit quibusdam non laboriosam porro Foo eos provident ab eum, wax Foo, rem unde quos sapiente natus eaque voluptatibus!'
  },
  {
    id: 2,
    company: 1,
    name: 'Bacon Product',
    description: 'Bacon ipsum dolor amet beef shank alcatra pork belly sausage kielbasa hamburger pastrami spare ribs pig kevin. Shoulder hamburger biltong, jowl tenderloin doner shankle andouille salami meatball drumstick frankfurter tongue t-bone. Capicola venison cupim, kevin picanha ribeye sausage tongue beef ribs bacon alcatra jerky rump shankle.'
  },
  {
    id: 3,
    company: 4,
    name: 'Italian Prochetta',
    description: 'Porchetta ball tip pastrami swine cupim meatloaf chuck sirloin meatball pancetta fatback. Boudin brisket sirloin jowl strip steak fatback turkey doner.'
  },
  {
    id: 4,
    company: 18,
    name: 'Pork Chop',
    description: 'Deserunt eu id pork chop nisi consequat in commodo flank pork. Doner fugiat corned beef jerky, filet mignon ground round ut short ribs meatloaf nisi.'
  }
];

// Schema for validating new products
var productSchema = joi.object().unknown().keys({
  name: joi.string().regex(/^(\w|\s)*$/).min(3).max(30).required(),
  description: joi.string().min(15).required()
});

var lastId = productData.length;
var getNextId = function() {
  lastId++;
  return lastId;
};

module.exports = function(app, express) {
  var router = express.Router();

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

      joi.validate(productCandidate, productSchema, function(err, value) {
        if (err) {
          return res.status(400)
            .send('Invalid product data');
        }

        newProduct = {
          id: getNextId(),
          company: 5, // This will need to change when company model is implemented
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
      res.json(req.product);
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

      productData = productData.filter(function(item) {
        return item.id !== productId;
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
        req.product.description = productCandidate.description;

        res.json(req.product);
      });
    });

  app.use('/products', router);
};
