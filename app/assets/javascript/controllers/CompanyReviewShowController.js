app.controller('CompanyReviewShowController', function(CompanyReview, $scope, $routeParams, $location, $window) {
  $scope.review = CompanyReview.get({reviewId: $routeParams.id, companyId: $routeParams.companyId});

  $scope.deleteReview = function(review) {
    if ($window.confirm('Are you sure you want to delete this review?\n' +
                      'This action cannot be undone.')) {
      // Convert the object to its id to generate the right url
      review.company = review.company.id;

      review.$delete().finally(function() {
        $location.path('/companies/' + review.company);
      });
    }
  };
});
