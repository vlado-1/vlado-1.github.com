// This is the controller for the default home view
angular
  .module("myApp")
  .controller("HomeController", function ($scope, $http, $location) {
    // Immediately send an HTTP request to get a list of phones
    $http({
      method: "GET",
      url: "/getPhones",
    }).then(
      function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.soldOutSoon = response["data"]["soldOutSoon"];
        $scope.bestSellers = response["data"]["bestSellers"];
      },
      function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("An error occurred!");
      }
    );

    // Info function that gets called when a row is clicked
    $scope.showInfo = function (phone) {
      // The phone id is injected into the url as a parameter to be retrieved
      $location.path("main/showInfo/" + phone["id"]);
    };
  });
