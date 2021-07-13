// Example of a GET request to the backend
angular
  .module("myApp")
  .controller(
    "ProfileController",
    function ($scope, $http, $rootScope, $location, $window) {
      $rootScope.username =  $window.localStorage.getItem("username");
      $rootScope.userid =  $window.localStorage.getItem("userid");
      $rootScope.email =  $window.localStorage.getItem("email");


      // Get the user profile info
      $http({
        method: "GET",
        url: "/getUser",
        params: { email: $rootScope.email },
      }).then(
        function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          user = response["data"]["user"];

          $scope.edit = {
            fName: user["firstname"],
            lName: user["lastname"],
            email: user["email"],
          };
        },
        function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log("An error occurred!");
        }
      );

      // Get the user's listings
      $scope.getPhoneListings = function () {
        $http({
          method: "GET",
          url: "/getListings",
          params: { userId: $rootScope.userid },
        }).then(
          function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.phones = response["data"]["phones"];
            console.log($scope.phones);
          },
          function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("An error occurred!");
          }
        );
      }
      $scope.getPhoneListings();

      // TODO IDENTIFY USER USING ID INSTEAD OF EMAIL TO PREVENT EMAIL DUPLICATE CHANGING
      $scope.editProfile = function (fName, lName, email, pwd) {
        $http({
          method: "POST",
          url: "/updateUser",
          data: {
            fName: fName,
            lName: lName,
            email: email,

            // Hash the password before sending it
            password: CryptoJS.MD5(pwd).toString(),
          },
        }).then(
          function successCallback(response) {
            $rootScope.getSignStatus();
            alert("Your profile has been successfully updated.");
          },
          function errorCallback(response) {
            if (response.status == 401) {
              alert("Incorrect password entered!");
            } else if (response.status == 409) {
              alert("Another user with the given email already exists.");
            }
          }
        );
      };

      $scope.changePassword = function (currentPwd, newPwd) {
        $http({
          method: "POST",
          url: "/changePassword",
          data: {
            currentPwd: CryptoJS.MD5(currentPwd).toString(),
            newPwd: CryptoJS.MD5(newPwd).toString(),
            email: $rootScope.email,
          },
        }).then(
          function successCallback(response) {
            alert("Your password has been successfully updated.");
          },
          function errorCallback(response) {
            alert("Incorrect password entered!");
          }
        );
      };

      // Function called when the status toggle for a phone is pressed
      $scope.toggleStatus = function (phone) {
        $http({
          method: "POST",
          url: "/togglePhone",
          data: {
            id: phone["_id"],
          },
        }).then(
          function successCallback(response) {
            console.log("done");
          },
          function errorCallback(response) {}
        );
      };

      $scope.createListing = function (phone) {
        $http({
          method: "POST",
          url: "/createListing",
          data: {
            phone: phone,
            user: $rootScope.userid,
          },
        }).then(
          function successCallback(response) {
            $scope.getPhoneListings();
            alert("The listing has been successfully created.");
          },
          function errorCallback(response) {}
        );
      };

      $scope.deleteListing = function (phone) {
        if (
          confirm("Are you sure you want to delete " + phone["title"] + "?")
        ) {
          $http({
            method: "POST",
            url: "/deleteListing",
            data: {
              phone: phone,
            },
            user: $rootScope.userid,
          }).then(
            function successCallback(response) {
              $scope.getPhoneListings();
              alert("The listing for " + phone["title"] + " has been deleted.");
            },
            function errorCallback(response) {}
          );
        }
      };
    }
  );
