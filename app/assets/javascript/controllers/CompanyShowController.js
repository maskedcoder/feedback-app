app.controller('CompanyShowController', function(Company, $scope, $routeParams, $location) {
  $scope.company = Company.get({companyId: $routeParams.id});

  $scope.stars = function() {
    var starCount = 0;

    // This may get called before the company data is fetched
    if (!$scope.company.reviews) {
      return 0;
    }

    $scope.company.reviews.forEach(function(review) {
      starCount += review.stars;
    });

    return starCount / $scope.company.reviews.length;
  };

  $scope.deleteCompany = function(company) {
    if (window.confirm('Are you sure you want to delete "' + company.name + '"? ' +
                      'This action cannot be undone.')) {
      company.$delete().finally(function() {
        $location.path('/companies/');
      });
    }
  };
});
