app.controller('ProductEditController', function(Product, $scope, $routeParams, $location) {
  $scope.product = Product.get({productId: $routeParams.id});
  $scope.isSubmitting = false;

  $scope.saveProduct = function(product) {
    $scope.isSubmitting = true;

    product.$update().finally(function() {
      $scope.isSubmitting = false;
      $location.path('/products/' + product.id);
    });
  };
});
