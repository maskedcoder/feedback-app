app.controller('CompanyReviewCreateController', function(Company, CompanyReview, $scope, $routeParams, $location) {
  $scope.company = Company.get({companyId: $routeParams.companyId});
  $scope.review = new CompanyReview({
    name: '',
    stars: 0,
    title: '',
    description: '',
    company: $routeParams.companyId
  });
  $scope.isSubmitting = false;

  $scope.createReview = function(review) {
    $scope.isSubmitting = true;

    review.$save(function(review) {
      $scope.isSubmitting = false;
      $location.path('/companies/' + review.company);
    });
  };
});
