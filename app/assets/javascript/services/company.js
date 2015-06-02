app.factory('Company', function($resource) {
  return $resource('/companies/:companyId',
                  {companyId: '@id'},
                  {update: {method: 'PUT'}}
  );
});
