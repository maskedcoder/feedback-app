exports.config = {

  // Connect directly to browser drivers without Selenium
  directConnect: true,

  // Spec files to run tests
  specs: [
    'specs.js'
  ],

  // Use Jasmine framework for tests
  framework: 'jasmine2',

  // Browsers to run tests on
  capabilities: {
    browserName: 'chrome'
  }

};
