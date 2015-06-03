app.controller('ProductEditController', function(Product, Company, $scope, $routeParams, $location) {
  $scope.companies = Company.query();
  $scope.product = Product.get({productId: $routeParams.id});
  $scope.isSubmitting = false;

  $scope.saveProduct = function(product) {
    $scope.isSubmitting = true;

    // Clean up product
    product.company = product.company.id;

    product.$update().finally(function() {
      $scope.isSubmitting = false;
      $location.path('/products/' + product.id);
    });
  };
});
