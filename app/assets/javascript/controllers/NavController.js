app.controller('NavController', function($scope, $location) {
  $scope.isActive = function(route) {
    return $location.path() === route;
  };
});
