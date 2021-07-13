// This is the controller for the default home view
angular
  .module("myApp")
  .controller(
    "HeaderController",
    function ($scope, $rootScope, $http, $location, $route, $window) {

      console.log( $window.localStorage.getItem("username"));

      $rootScope.signed_in = ($window.localStorage.getItem("signin") === 'true');
      $rootScope.username =  $window.localStorage.getItem("username");
      $rootScope.userid =  $window.localStorage.getItem("userid");
      $rootScope.email =  $window.localStorage.getItem("email");

      // Get information on whether the user is signed-in
      $rootScope.getSignStatus = function (callback) {
        $http({
          method: "GET",
          url: "/loginStatus",
        }).then(
          function successCallback(response) {
            // Modify global variables to show user is logged in
            $rootScope.signed_in = response["data"]["status"];
            $rootScope.username = response["data"]["user"];
            $rootScope.userid = response["data"]["userid"];
            $rootScope.email = response["data"]["email"];

            // To save root data so that it is immune to page refresh
            $window.localStorage.setItem("signin", $rootScope.signed_in);
            $window.localStorage.setItem("username", $rootScope.username);
            $window.localStorage.setItem("userid", $rootScope.userid);
            $window.localStorage.setItem("email", $rootScope.email);

            console.log($window.localStorage.getItem("username"));

            // Go to location after getting status
            if (callback != null) {
              callback();
            }
          },
          function errorCallback(response) {
            // Log the error status.
            console.log("Error occured while getting sign in status!");
            alert("An Error occured whilst getting sign in status");
          }
        );
      };

      // Log the user out of the website
      $scope.logOut = function () {
        $http({
          method: "GET",
          url: "/logOut",
        }).then(
          function successCallback(response) {
            // Modify global variables to show log out succeded
            $rootScope.signed_in = !response["data"]["logout"];
            $rootScope.username = "";
            $rootScope.userid = "";
            $rootScope.email = "";

            // Reset root data in window
            $window.localStorage.setItem("signin", $rootScope.signed_in);
            $window.localStorage.setItem("username", "");
            $window.localStorage.setItem("userid", "");
            $window.localStorage.setItem("email", "");

            alert("Successfully Logged Out!")
            $location.path("/")
          },
          function errorCallback(response) {
            console.log("Error occurred while logging out!");
            alert("Error occured whilst logging out!");
          }
        );
      };

      // Get sign in status at regualr intervals
      window.setInterval($rootScope.getSignStatus, 10000);

      // Goes to login page or logs out
      $scope.login = function () {
        if (!$rootScope.signed_in) {
          $window.localStorage.setItem("prevLoc", $location.path());
          $location.path("auth/");
        } else {
          $scope.logOut();
        }
      };

      $scope.verifyGoToProfile = function () {
        if (!$rootScope.signed_in) {
          $window.localStorage.setItem("prevLoc", "/user/profile");
          $location.path("auth/");
        } else {
          $location.path("/user/profile");
        }
      };
    }
  );
