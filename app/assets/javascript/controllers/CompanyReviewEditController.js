app.controller('CompanyReviewEditController', function(CompanyReview, $scope, $routeParams, $location) {
  $scope.review = CompanyReview.get({reviewId: $routeParams.id, companyId: $routeParams.companyId});
  $scope.isSubmitting = false;

  $scope.saveReview = function(review) {
    $scope.isSubmitting = true;

    // Convert the object to its id to generate the right url
    review.company = review.company.id;

    review.$update().finally(function() {
      $scope.isSubmitting = false;
      $location.path('/companies/' + review.company + '/reviews/' + review.id);
    });
  };
});
