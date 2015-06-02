app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/assets/templates/home.html',
      controller: 'HomeController'
    })
    .when('/products', {
      templateUrl: '/assets/templates/products/index.html',
      controller: 'ProductController'
    })
    .when('/products/new', {
      templateUrl: '/assets/templates/products/create.html',
      controller: 'ProductCreateController'
    })
    .when('/products/:id', {
      templateUrl: '/assets/templates/products/show.html',
      controller: 'ProductShowController'
    })
    .when('/products/:id/edit', {
      templateUrl: '/assets/templates/products/edit.html',
      controller: 'ProductEditController'
    })
    .when('/companies', {
      templateUrl: '/assets/templates/companies/index.html',
      controller: 'CompanyController'
    })
    .when('/companies/new', {
      templateUrl: '/assets/templates/companies/create.html',
      controller: 'CompanyCreateController'
    })
    .when('/companies/:id', {
      templateUrl: '/assets/templates/companies/show.html',
      controller: 'CompanyShowController'
    })
    .when('/companies/:id/edit', {
      templateUrl: '/assets/templates/companies/edit.html',
      controller: 'CompanyEditController'
    });
});
