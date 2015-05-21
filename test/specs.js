describe('Feedback app', function() {

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
