app.controller('ProductCreateController', function(Product, Company, $scope, $routeParams, $location) {
  $scope.companies = Company.query();
  $scope.product = new Product({name: '', description: '', company: 0});
  $scope.isSubmitting = false;

  $scope.createProduct = function(product) {
    $scope.isSubmitting = true;

    // Clean up product
    product.company = product.company.id;

    product.$save(function(p) {
      $scope.isSubmitting = false;
      $location.path('/products/' + p.id);
    });
  };
});
