// Example of a GET request to the backend
angular
  .module("myApp")
  .controller(
    "AuthController",
    function ($scope, $rootScope, $http, $location, $window) {
      // Gather form data and save to DB
      $scope.registerBtn = function (fName, lName, email, password) {
        if (!fName || !lName || !email || !password) {
          console.log("Invalid input");
          alert("Invalid input");
          return;
        }

        $http({
          method: "POST",
          url: "/registerUser",
          data: {
            fName: fName,
            lName: lName,
            email: email,

            // Hash the password before sending it
            password: CryptoJS.MD5(password).toString(),
          },
        }).then(
          function successCallback(response) {
            if (response.status == 201) {
              alert("Successfully Registered.");
              $rootScope.getSignStatus(function() {
                var prevLoc = $window.localStorage.getItem("prevLoc");
                if (prevLoc != null){
                  $location.path(prevLoc);   
                }
              });
            }
          },
          function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert("A user with this email already exists.");
          }
        );
      };

      // Check if username and password are correct
      $scope.loginBtn = function (email, password) {
        if (!email || !password) {
          console.log("Invalid input");
          alert("Invalid input");
          return;
        }

        $http({
          method: "POST",
          url: "/loginUser",
          data: {
            email: email,

            // Hash the password before sending it
            password: CryptoJS.MD5(password).toString(),
          },
        }).then(
          function successCallback(response) {
            if (response.status == 201) {
              alert("Successfully Signed In.");
              $rootScope.getSignStatus(function() {
                var prevLoc = $window.localStorage.getItem("prevLoc");
                if (prevLoc != null){
                  $location.path(prevLoc);   
                }
              });
            }
          },
          function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("Email or password are incorrect.");
            alert("Email or password are incorrect.");
          }
        );
      };

      $scope.select_login = false;
      $scope.select_register = false;

      // User selects login mode
      $scope.loginMode = function () {
        $scope.select_login = !$scope.select_login;
      };

      // User selects register mode
      $scope.registerMode = function () {
        $scope.select_register = !$scope.select_register;
      };

      // User cancels attempt to sign-in
      $scope.returnUser = function () {
        var prevLoc = $window.localStorage.getItem("prevLoc");
        if ($rootScope.signed_in == false && (prevLoc === "/user/profile" || prevLoc === "/checkout")) {
          $location.path("/#");
        }
        else {
          $location.path(prevLoc);
        }
      };
    }
  );
