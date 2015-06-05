// Store the id of any new review created, so we can use it later
var ID;

describe('Company page', function() {

  beforeEach(function() {
    browser.get('http://localhost:3000/#/companies/2');
  });

  it('should render all the company\'s reviews', function() {
    var reviews = element.all(by.repeater('review in company.review'));

    expect(reviews.count()).toBe(3);
    expect(reviews.get(0).$('h3').getText()).toContain('Provident Ab Eum');
    expect(reviews.get(1).$('h3').getText()).toContain('lacus metus');
    expect(reviews.get(2).$('h3').getText()).toContain('Pharetra enim posuere');

    // Test for buttons
    expect($$('.qa-new-review-button').count()).toBe(1);
  });

  it('should allow creating a company', function() {
    // Find the edit button and click it
    var newBtn = element(by.css('.qa-new-review-button'));
    newBtn.click();

    // We should be on the edit page now
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/companies/2/reviews/new');

    // Ctrl+A to select input contents and replace it
    $('.qa-edit-name').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                               'Test Dummy');
    $('.qa-edit-title').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                               'Test Review');
    $('.qa-edit-stars').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                               '3');
    $('.qa-edit-description').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                               'This review was automatically generated during testing.');

    // Test for buttons
    expect($$('.qa-cancel-create').count()).toBe(1);

    // Submit the form
    var submitBtn = element(by.css('.qa-submit-form'));
    submitBtn.click();

    // We should be on the company show page now
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/companies/2');

    // Find the correct review
    var review = element.all(by.repeater('review in company.review')).last();

    // Cache the id
    review.element(by.css('h3 a'))
      .getWebElement()
      .getAttribute('href')
      .then(function(url) {
        ID = url.split('reviews/')[1];
      });

    var name = review.element(by.binding('review.name'));
    expect(name.getText()).toContain('Test Dummy');
    var description = review.element(by.binding('review.description'));
    expect(description.getText()).toEqual('This review was automatically generated during testing.');
    var stars = review.element(by.css('ng-pluralize[count="review.stars"]'));
    expect(stars.getText()).toContain('3');
    var title = review.element(by.binding('review.title'));
    expect(title.getText()).toEqual('Test Review');
  });
});

describe('Company Review actions', function() {
  beforeEach(function() {
    browser.get('http://localhost:3000/#/companies/2/reviews/' + ID);
  });

  it('should render a single review', function() {
    var name = element.all(by.binding('review.name')).first();
    expect(name.getText()).toContain('Test Dummy');
    var description = element(by.binding('review.description'));
    expect(description.getText()).toEqual('This review was automatically generated during testing.');
    var stars = element(by.css('ng-pluralize[count="review.stars"]'));
    expect(stars.getText()).toContain('3');
    var title = element(by.binding('review.title'));
    expect(title.getText()).toContain('Test Review');

    // Test for buttons
    expect($$('.qa-edit-button').count()).toBe(1);
    expect($$('.qa-delete-button').count()).toBe(1);
  });

  it('should allow editing a review', function() {
    // Find the edit button and click it
    var editBtn = element(by.css('.qa-edit-button'));
    editBtn.click();

    // We should be on the edit page now
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/companies/2/reviews/' + ID + '/edit');

    // Ctrl+A to select input contents and replace it
    $('.qa-edit-name').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                               'New Name');
    $('.qa-edit-title').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                               'Test Review Edited');
    $('.qa-edit-stars').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                               '2');
    $('.qa-edit-description').sendKeys(protractor.Key.CONTROL, 'a', protractor.Key.NULL,
                               'This review was automatically edited during testing.');

    // Test for buttons
    expect($$('.qa-cancel-edit').count()).toBe(1);

    // Submit the form
    var submitBtn = element(by.css('.qa-submit-form'));
    submitBtn.click();

    // We should be on the show page now
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/companies/2/reviews/' + ID);

    var heading = element.all(by.binding('review.name')).first();
    expect(heading.getText()).toContain('New Name');
    var description = element(by.binding('review.description'));
    expect(description.getText()).toEqual('This review was automatically edited during testing.');
    var stars = element(by.css('ng-pluralize[count="review.stars"]'));
    expect(stars.getText()).toContain('2');
    var title = element(by.binding('review.title'));
    expect(title.getText()).toContain('Test Review Edited');
  });

  it('should allow deleting a review', function() {
    // Find the edit button and click it
    var editBtn = element(by.css('.qa-delete-button'));
    editBtn.click();

    // Confirm delete
    var confirmDialog = browser.switchTo().alert()
    confirmDialog.accept();

    // We should be on the company show page now
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/companies/2');

    // Test that there is one fewer review (start with 3, add 1, delete 1 = 3)
    var reviews = element.all(by.repeater('review in company.review'));
    expect(reviews.count()).toBe(3);
  });
});
