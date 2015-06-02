app.controller('CompanyCreateController', function(Company, $scope, $routeParams, $location) {
  $scope.company = new Company({name: ''});
  $scope.isSubmitting = false;

  $scope.createCompany = function(company) {
    $scope.isSubmitting = true;

    company.$save(function(p) {
      $scope.isSubmitting = false;
      $location.path('/companies/' + p.id);
    });
  };
});
