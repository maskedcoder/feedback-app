var joi = require('joi');
var express = require('express');

/**
 * Initialize the router
 *
 * @param {Object}  dataStore    An object that will be used as a database
 * @returns {Object}
 */
module.exports = function(dataStore) {
  var companyData = dataStore.companyData;
  var companyReviewData = dataStore.companyReviewData;
  var productData = dataStore.productData;

  // Schema for validating new companies
  var companySchema = joi.object().unknown().keys({
    name: joi.string().min(3).max(30).required()
  });

  // Schema for validating new reviews
  var companyReviewSchema = joi.object().unknown().keys({
    name: joi.string().min(3).max(30).required(),
    stars: joi.number().integer().min(0).max(5).required(),
    company: joi.number().integer().required(),
    title: joi.string().min(0).max(40),
    description: joi.string().min(3).required()
  });

  var lastId = companyData.length;
  var getNextId = function() {
    lastId++;
    return lastId;
  };

  var lastReviewId = companyReviewData.length;
  var getNextReviewId = function() {
    lastReviewId++;
    return lastReviewId;
  };

  router = express.Router();

  /**
   * Fetch a company by id when :id url param is given
   */
  router.param('company_id', function(req, res, next, id) {
      var i = 0;
      var len = companyData.length;
      id = Number(id); // Route params are strings

      for (; i < len; i++) {
        if (companyData[i].id === id) {
          req.company = companyData[i];
          req.products = [];
          req.reviews = [];

          // Get a list of products belonging to the company
          productData.forEach(function(product) {
            if (product.company === id) {
              req.products.push(product);
            }
          });

          // Get all the company's reviews
          companyReviewData.forEach(function(review) {
            if (review.company === id) {
              req.reviews.push(review);
            }
          });

          return next();
        }
      }

      // No company has been found, so it must not exist
      res.status(404)
        .send('Company ' + id + ' not found');
    })

  /**
   * Fetch a review by id when :id url param is given
   */
  router.param('review_id', function(req, res, next, id) {
      var i = 0;
      var len = companyReviewData.length;
      id = Number(id); // Route params are strings

      for (; i < len; i++) {
        if (companyReviewData[i].id === id) {
          req.review = companyReviewData[i];

          // Get the company that owns the review
          for (i = 0, len = companyData.length; i < len; i++) {
            if (companyData[i].id = req.review.company) {
              req.company = companyData[i];
              return next();
            }
          }

          // Couldn't find the company! This could cause an error
          return next();
        }
      }

      // No review has been found, so it must not exist
      res.status(404)
        .send('Review ' + id + ' not found');
    })

  router.route('/')

    /**
     * Get a list of all companies
     *
     * GET /companies
     */
    .get(function(req, res) {
      res.json(companyData);
    })

    /**
     * Post a new company
     *
     * POST /companies
     */
    .post(function(req, res) {
      var companyCandidate = req.body;
      var newCompany = {};

      joi.validate(companyCandidate, companySchema, function(err, value) {
        if (err) {
          return res.status(400)
            .send('Invalid company data');
        }

        newCompany = {
          id: getNextId(),
          name: companyCandidate.name
        };
        companyData.push(newCompany);

        res.status(201)
          .json(newCompany);
      });
    });

  router.route('/:company_id')

    /**
     * Get a single company
     *
     * GET /companies/##
     */
    .get(function(req, res) {
      // Copy the object so attributes can be safely added
      var company = JSON.parse(JSON.stringify(req.company));

      // Add a list of products and reviews
      company.products = req.products;
      company.reviews = req.reviews;

      res.json(company);
    })

    /**
     * Delete a single company
     *
     * DELETE /companies/##
     */
    .delete(function(req, res) {
      // oldLength and newLength are used to detect errors
      var oldLength = companyData.length;
      var newLength = 0;
      var companyId = req.company.id;

      // Use forEach instead of filter so the actual object is edited
      // (and thus the change exists for other route files as well)
      companyData.forEach(function(item, index) {
        if (item.id === companyId) {
          companyData.splice(index, 1);
        }
      });

      // Remove products belonging to the company
      productData.forEach(function(item, index) {
        if (item.company === companyId) {
          productData.splice(index, 1);
        }
      });

      delete req.company;
      delete req.products;

      newLength = companyData.length;

      if (newLength === oldLength) {
        // Length did not change, so the company by that id did not exist
        res.sendStatus(404);
      } else if (newLength === oldLength - 1) {
        // Length is what we expected
        res.sendStatus(204);
      } else {
        // Length changed unexpectedly, so something is wrong
        res.sendStatus(500);
        console.error('Delete company #' + companyId + ' resulted in bad data:');
        console.error('    Old data length: ' + oldLength);
        console.error('    New data length:' + newLength);
      }
    })

    /**
     * Update a single company
     *
     * PUT /companies/##
     */
    .put(function(req, res) {
      var companyCandidate = req.body;

      joi.validate(companyCandidate, companySchema, function(err, value) {
        if (err) {
          return res.status(400)
            .send('Invalid company data');
        }

        req.company.name = companyCandidate.name;

        res.json(req.company);
      });
    });

  router.route('/:company_id/reviews/')

    /**
     * Get a list of all reviews for this company
     *
     * GET /companies/##/reviews/
     */
    .get(function(req, res) {
      res.json(req.reviews);
    })

    /**
     * Post a new review
     *
     * POST /companies/##/reviews/
     */
    .post(function(req, res) {
      var reviewCandidate = req.body;
      var newReview = {};

      joi.validate(reviewCandidate, companyReviewSchema, function(err, value) {
        if (err) {
          return res.status(400)
            .send('Invalid review data');
        }

        newReview = {
          id: getNextReviewId(),
          name: reviewCandidate.name,
          stars: reviewCandidate.stars,
          company: req.company.id,
          title: reviewCandidate.title,
          description: reviewCandidate.description
        };
        companyReviewData.push(newReview);

        res.status(201)
          .json(newReview);
      });
    });

  router.route('/:company_id/reviews/:review_id')

    /**
     * Get a single company review
     *
     * GET /companies/##/reviews/##
     */
    .get(function(req, res) {
      // Copy the object so attributes can be safely added
      var review = JSON.parse(JSON.stringify(req.review));

      // Add the company
      review.company = req.company;

      res.json(review);
    })

    /**
     * Delete a single review
     *
     * DELETE /companies/##/reviews/##
     */
    .delete(function(req, res) {
      // oldLength and newLength are used to detect errors
      var oldLength = companyReviewData.length;
      var newLength = 0;
      var reviewId = req.review.id;

      // Use forEach instead of filter so the actual object is edited
      // (and thus the change exists for other route files as well)
      companyReviewData.forEach(function(item, index) {
        if (item.id === reviewId) {
          companyReviewData.splice(index, 1);
        }
      });

      delete req.review;

      newLength = companyReviewData.length;

      if (newLength === oldLength) {
        // Length did not change, so the company by that id did not exist
        res.sendStatus(404);
      } else if (newLength === oldLength - 1) {
        // Length is what we expected
        res.sendStatus(204);
      } else {
        // Length changed unexpectedly, so something is wrong
        res.sendStatus(500);
        console.error('Delete company review #' + reviewId + ' resulted in bad data:');
        console.error('    Old data length: ' + oldLength);
        console.error('    New data length:' + newLength);
      }
    })

    /**
     * Update a single company
     *
     * PUT /companies/##/reviews/##
     */
    .put(function(req, res) {
      var reviewCandidate = req.body;

      joi.validate(reviewCandidate, companyReviewSchema, function(err, value) {
        if (err) {
          return res.status(400)
            .send('Invalid review data');
        }

        req.review.name = reviewCandidate.name;
        req.review.title = reviewCandidate.title;
        req.review.stars = reviewCandidate.stars;
        req.review.description = reviewCandidate.description;

        res.json(req.review);
      });
    });

  return router;
};
