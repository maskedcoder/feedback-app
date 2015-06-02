app.controller('CompanyShowController', function(Company, $scope, $routeParams, $location) {
  $scope.company = Company.get({companyId: $routeParams.id});

  $scope.deleteCompany = function(company) {
    if (window.confirm('Are you sure you want to delete "' + company.name + '"? ' +
                      'This action cannot be undone.')) {
      company.$delete().finally(function() {
        $location.path('/companies/');
      });
    }
  };
});
