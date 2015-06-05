app.factory('CompanyReview', function($resource) {
  return $resource('/companies/:companyId/reviews/:reviewId',
                  {reviewId: '@id', companyId: '@company'},
                  {update: {method: 'PUT'}}
  );
});
