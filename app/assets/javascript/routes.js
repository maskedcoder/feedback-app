app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/assets/templates/home.html',
      controller: 'HomeController'
    })
    .when('/products', {
      templateUrl: '/assets/templates/products/index.html',
      controller: 'ProductController'
    });
});
