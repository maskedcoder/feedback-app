app.controller('CompanyController', function(Company, $scope) {
  $scope.companies = Company.query();
});
