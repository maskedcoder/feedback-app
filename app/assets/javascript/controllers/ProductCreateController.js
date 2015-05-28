app.controller('ProductCreateController', function(Product, $scope, $routeParams, $location) {
  $scope.product = new Product({name: '', description: ''});
  $scope.isSubmitting = false;

  $scope.createProduct = function(product) {
    $scope.isSubmitting = true;

    product.$save(function(p) {
      $scope.isSubmitting = false;
      $location.path('/products/' + p.id);
    });
  };
});
