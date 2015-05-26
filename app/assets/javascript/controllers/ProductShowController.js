app.controller('ProductShowController', function(Product, $scope, $routeParams) {
  $scope.product = Product.get({productId: $routeParams.id});
});
