app.controller('HomeController', function(Product, $scope) {
  $scope.products = Product.query();
});
