// This function dictates what happens on application launch, including routing config
angular.module("myApp").config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider

    .when("/", {
      templateUrl: "html/main/home.html",
      controller: "HomeController",
    })
  	.when("/checkout", {
      templateUrl: "html/checkout/checkout.html",
      controller: "CheckoutController",
    })
    .when("/main/showInfo/:id", {
      templateUrl: "html/main/info.html",
      controller: "InfoController",
    })

    .when("/main/search/:title", {
      templateUrl: "html/main/search.html",
      controller: "SearchController",
    })

    .when("/auth", {
      templateUrl: "html/login/auth.html",
      controller: "AuthController",
    })

    .when("/user/profile", {
      templateUrl: "html/profile/profile.html",
      controller: "ProfileController",
    })

    .otherwise({ redirectTo: "/" });
});
