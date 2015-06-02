var joi = require('joi');
var express = require('express');

var companyData = [
  {
    id: 1,
    name: 'Example Industries'
  },
  {
    id: 2,
    name: 'Bar Products LTD'
  },
  {
    id: 3,
    name: 'Sausage Gmbh'
  },
  {
    id: 4,
    name: 'Pork R Us'
  }
];

// Schema for validating new companies
var companySchema = joi.object().unknown().keys({
  name: joi.string().min(3).max(30).required()
});

var lastId = companyData.length;
var getNextId = function() {
  lastId++;
  return lastId;
};

// Initialize router
module.exports = router = express.Router();

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
        return next();
      }
    }

    // No company has been found, so it must not exist
    res.status(404)
      .send('Company ' + id + ' not found');
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
    res.json(req.company);
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

    companyData = companyData.filter(function(item) {
      return item.id !== companyId;
    });

    delete req.company;

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
