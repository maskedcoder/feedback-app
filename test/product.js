// Store the id of any new product created, so we can use it
var ID;

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

    // Select an option
    element(by.cssContainingText('option', 'Bar Products LTD')).click();

    // Test for buttons
    expect($$('.qa-cancel-create').count()).toBe(1);

    // Submit the form
    var submitBtn = element(by.css('.qa-submit-form'));
    submitBtn.click();

    // We should be on the show page now
    expect(browser.getCurrentUrl()).toMatch(/http:\/\/localhost:3000\/#\/products\/\d+/);

    // Cache the id
    browser.getCurrentUrl().then(function(url) {
      ID = url.split('products/')[1];
    });

    var heading = element(by.binding('product.name'));
    expect(heading.getText()).toContain('New Product');
    expect(heading.getText()).toContain('Bar Products LTD');

    var description = element(by.binding('product.description'));
    expect(description.getText()).toEqual('This is an extremely short and unhelpful description.');
  });
});

describe('Product actions', function() {
  beforeEach(function() {
    browser.get('http://localhost:3000/#/products/' + ID);
  });

  it('should render a single product', function() {
    var heading = element(by.binding('product.name'));
    expect(heading.getText()).toContain('New Product');
    expect(heading.getText()).toContain('Bar Products LTD');

    var description = element(by.binding('product.description'));
    expect(description.getText()).toEqual('This is an extremely short and unhelpful description.');

    // Test for buttons
    expect($$('.qa-edit-button').count()).toBe(1);
    expect($$('.qa-delete-button').count()).toBe(1);
  });

  it('should allow editing a product', function() {
    // Find the edit button and click it
    var editBtn = element(by.css('.qa-edit-button'));
    editBtn.click();

    // We should be on the edit page now
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/products/' + ID + '/edit');

    // Ctrl+A to select input contents and replace it
    $('.qa-edit-name').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                               'New Name');

    $('.qa-edit-description').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                               'This is an extremely unhelpful and short description.');

    // Select an option
    element(by.cssContainingText('option', 'Pork R Us')).click();

    // Test for buttons
    expect($$('.qa-cancel-edit').count()).toBe(1);

    // Submit the form
    var submitBtn = element(by.css('.qa-submit-form'));
    submitBtn.click();

    // We should be on the show page now

    var heading = element(by.binding('product.name'));
    expect(heading.getText()).toContain('New Name');
    expect(heading.getText()).toContain('Pork R Us');

    var description = element(by.binding('product.description'));
    expect(description.getText()).toEqual('This is an extremely unhelpful and short description.');
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
