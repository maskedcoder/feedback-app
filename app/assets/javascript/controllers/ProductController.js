app.controller('ProductController', function(Product, $scope) {
  $scope.products = Product.query();
});
