app.controller('ProductShowController', function(Product, $scope, $routeParams, $location) {
  $scope.product = Product.get({productId: $routeParams.id});

  $scope.deleteProduct = function(product) {
    if (window.confirm('Are you sure you want to delete "' + product.name + '"? ' +
                      'This action cannot be undone.')) {
      product.$delete().finally(function() {
        $location.path('/products/');
      });
    }
  };
});
