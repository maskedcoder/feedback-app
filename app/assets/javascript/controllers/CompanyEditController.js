app.controller('CompanyEditController', function(Company, $scope, $routeParams, $location) {
  $scope.company = Company.get({companyId: $routeParams.id});
  $scope.isSubmitting = false;

  $scope.saveCompany = function(company) {
    $scope.isSubmitting = true;

    company.$update().finally(function() {
      $scope.isSubmitting = false;
      $location.path('/companies/' + company.id);
    });
  };
});
