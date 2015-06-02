describe('Feedback app', function() {

  describe('Main page', function() {
    beforeEach(function() {
      browser.get('http://localhost:3000');
    });

    it('should render the first three products on the home page', function() {
      var products = element.all(by.repeater('product in products'));

      expect(products.count()).toBe(3);
      expect(products.get(0).$('h2').getText()).toEqual('Foo Wax');
      expect(products.get(1).$('h2').getText()).toEqual('Bacon Product');
      expect(products.get(2).$('h2').getText()).toEqual('Italian Prochetta');
    });
  });

  describe('Products page', function() {
    beforeEach(function() {
      browser.get('http://localhost:3000/#/products');
    });

    it('should render all the products', function() {
      var products = element.all(by.repeater('product in products'));

      expect(products.count()).toBe(4);
      expect(products.get(0).$('h2').getText()).toEqual('Foo Wax');
      expect(products.get(1).$('h2').getText()).toEqual('Bacon Product');
      expect(products.last().$('h2').getText()).toEqual('Pork Chop');

      // Test for buttons
      expect($$('.qa-new-button').count()).toBe(1);
    });

    it('should allow creating a product', function() {
      // Find the edit button and click it
      var newBtn = element(by.css('.qa-new-button'));
      newBtn.click();

      // We should be on the edit page now
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/products/new');

      // Ctrl+A to select input contents and replace it
      $('.qa-edit-name').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                                 'New Product');

      $('.qa-edit-description').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                                 'This is an extremely short and unhelpful description.');

      // Test for buttons
      expect($$('.qa-cancel-create').count()).toBe(1);

      // Submit the form
      var submitBtn = element(by.css('.qa-submit-form'));
      submitBtn.click();

      // We should be on the show page now
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/products/5');

      var heading = element(by.binding('product.name'));
      expect(heading.getText()).toEqual('New Product');

      var description = element(by.binding('product.description'));
      expect(description.getText()).toEqual('This is an extremely short and unhelpful description.');
    });
  });

  describe('Product actions', function() {
    beforeEach(function() {
      browser.get('http://localhost:3000/#/products/1');
    });

    it('should render a single product', function() {
      var heading = element(by.binding('product.name'));
      expect(heading.getText()).toEqual('Foo Wax');

      var description = element(by.binding('product.description'));
      expect(description.getText()).toEqual('Lorem Foo Wax dolor sit amet, consectetur adipisicing elit. Perspiciatis ullam consequuntur velit quibusdam non laboriosam porro Foo eos provident ab eum, wax Foo, rem unde quos sapiente natus eaque voluptatibus!');

      // Test for buttons
      expect($$('.qa-edit-button').count()).toBe(1);
      expect($$('.qa-delete-button').count()).toBe(1);
    });

    it('should allow editing a product', function() {
      // Find the edit button and click it
      var editBtn = element(by.css('.qa-edit-button'));
      editBtn.click();

      // We should be on the edit page now
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/products/1/edit');

      // Ctrl+A to select input contents and replace it
      $('.qa-edit-name').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                                 'New Name');

      $('.qa-edit-description').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                                 'This is an extremely short and unhelpful description.');

      // Test for buttons
      expect($$('.qa-cancel-edit').count()).toBe(1);

      // Submit the form
      var submitBtn = element(by.css('.qa-submit-form'));
      submitBtn.click();

      // We should be on the show page now
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/products/1');

      var heading = element(by.binding('product.name'));
      expect(heading.getText()).toEqual('New Name');

      var description = element(by.binding('product.description'));
      expect(description.getText()).toEqual('This is an extremely short and unhelpful description.');
    });

    it('should allow deleting a product', function() {
      // Find the edit button and click it
      var editBtn = element(by.css('.qa-delete-button'));
      editBtn.click();

      // Confirm delete
      var confirmDialog = browser.switchTo().alert()
      confirmDialog.accept();

      // We should be on the index page now
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/products');

      // Test that there is one fewer product (start with 4, add 1, delete 1 = 4)
      var products = element.all(by.repeater('product in products'));
      expect(products.count()).toBe(4);
    });
  });

  describe('Companies page', function() {
    beforeEach(function() {
      browser.get('http://localhost:3000/#/companies');
    });

    it('should render all the companies', function() {
      var companies = element.all(by.repeater('company in companies'));

      expect(companies.count()).toBe(4);
      expect(companies.get(0).$('h2').getText()).toEqual('Example Industries');
      expect(companies.get(1).$('h2').getText()).toEqual('Bar Products LTD');
      expect(companies.last().$('h2').getText()).toEqual('Pork R Us');

      // Test for buttons
      expect($$('.qa-new-button').count()).toBe(1);
    });

    it('should allow creating a company', function() {
      // Find the edit button and click it
      var newBtn = element(by.css('.qa-new-button'));
      newBtn.click();

      // We should be on the edit page now
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/companies/new');

      // Ctrl+A to select input contents and replace it
      $('.qa-edit-name').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                                 'New Company');

      // Test for buttons
      expect($$('.qa-cancel-create').count()).toBe(1);

      // Submit the form
      var submitBtn = element(by.css('.qa-submit-form'));
      submitBtn.click();

      // We should be on the show page now
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/companies/5');

      var name = element(by.binding('company.name'));
      expect(name.getText()).toEqual('New Company');
    });
  });

  describe('Company actions', function() {
    beforeEach(function() {
      browser.get('http://localhost:3000/#/companies/1');
    });

    it('should render a single company', function() {
      var heading = element(by.binding('company.name'));
      expect(heading.getText()).toEqual('Wax Wiser Incorporated');

      // Test for buttons
      expect($$('.qa-edit-button').count()).toBe(1);
      expect($$('.qa-delete-button').count()).toBe(1);
    });

    it('should allow editing a company', function() {
      // Find the edit button and click it
      var editBtn = element(by.css('.qa-edit-button'));
      editBtn.click();

      // We should be on the edit page now
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/companies/1/edit');

      // Ctrl+A to select input contents and replace it
      $('.qa-edit-name').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                                 'New Name');

      // Test for buttons
      expect($$('.qa-cancel-edit').count()).toBe(1);

      // Submit the form
      var submitBtn = element(by.css('.qa-submit-form'));
      submitBtn.click();

      // We should be on the show page now
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/companies/1');

      var heading = element(by.binding('company.name'));
      expect(heading.getText()).toEqual('New Name');
    });

    it('should allow deleting a company', function() {
      // Find the edit button and click it
      var editBtn = element(by.css('.qa-delete-button'));
      editBtn.click();

      // Confirm delete
      var confirmDialog = browser.switchTo().alert()
      confirmDialog.accept();

      // We should be on the index page now
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/companies');

      // Test that there is one fewer company (start with 4, add 1, delete 1 = 4)
      var companies = element.all(by.repeater('company in companies'));
      expect(companies.count()).toBe(4);
    });
  });
});
