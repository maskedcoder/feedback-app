exports.config = {

  // Connect directly to browser drivers without Selenium
  directConnect: true,

  // Spec files to run tests
  specs: [
    'product.js',
    'company.js',
    'companyReview.js'
  ],

  // Use Jasmine framework for tests
  framework: 'jasmine2',

  // Browsers to run tests on
  capabilities: {
    browserName: 'chrome'
  }

};
