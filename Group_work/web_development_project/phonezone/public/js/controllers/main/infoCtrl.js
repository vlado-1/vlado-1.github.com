angular
  .module("myApp")
  .controller("InfoController", function ($scope, $rootScope, $http, $routeParams, $location, $window) {
    
    // Get all required phone information
    $http({
      method: "GET",
      url: "/getInfo",
      params: { id: $routeParams.id },
    }).then(
      function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.phone = response["data"]["phone"][0];
      },
      function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("An error occurred!");
      }
    );
    
    // Get how much of this phone the user has in their cart
    $http({
      method: "GET",
      url: "/getCartAmount",
      params: { id: $routeParams.id},
    }).then(
      function successCallback(response) {
        $scope.cart_quantity = response["data"]["cartQty"];
      },
      function errorCallback(response) {
        console.log("An error occurred while getting data from cart!");
      }
    );
    
    // Resitricts review character count to 200, or shows all
    $scope.showText = function (review) {
      if (review.show_all) {
        review.show_all = false;
      }
      else {
        review.show_all = true;
      }
    };

    // Restricts reviews shown, or shows all
    $scope.num_reviews_shown = 3;
    $scope.show_all_reviews = false;
    $scope.showReviews = function(reviews) {
      $scope.show_all_reviews = !$scope.show_all_reviews;
      
      if ($scope.show_all_reviews) {
        $scope.num_reviews_shown = reviews.length;
      }
      else {
        $scope.num_reviews_shown = 3;
      }
    }
    
    // Adds phone to cart
    $scope.selected_quantity = 0;
    $scope.addToCart = function () {
      
      // If not signed-in, go to sign-in/sign-up page
      if (!$rootScope.signed_in) {
        $window.localStorage.setItem("prevLoc", $location.path());
        $location.path("auth/");
      }
      else {
        if ($scope.selected_quantity > 0) {
          // Otherwise add phone quantity to the cart on server
          $http({
            method: "POST",
            url: "/addToCart",
            data: { id: $routeParams.id,
                    qty: $scope.selected_quantity, },
          }).then(
            function successCallback(response) {
              // this callback will be called asynchronously
              // when the response is available
              $scope.cart_quantity = response["data"]["cartQty"];
              alert("Succesfully added item to cart!");
            },
            function errorCallback(response) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log("An error occurred while adding to cart!");
              alert("Error adding item to cart!");
            }
          );
        }
      }
      // Reset the number of items selected after adding to cart
      $scope.selected_quantity = 0;
    }

    // Post Review
    $scope.postReview = function() {
      if (!$rootScope.signed_in) {
        $window.localStorage.setItem("prevLoc", $location.path());
        $location.path("auth/");
      }
      else {
        if ($scope.comment.length > 0) {
          // Otherwise add phone quantity to the cart on server
          $http({
            method: "POST",
            url: "/postReview",
            data: { phoneid: $routeParams.id,
                    rating: $scope.rating,
                    review: $scope.comment },
          }).then(
            function successCallback(response) {
              // this callback will be called asynchronously
              // when the response is available
              alert("Succesfully posted a review!");
              $scope.rating = '';
              $scope.comment = '';
            },
            function errorCallback(response) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log("An error occurred while posting a review!");
              alert("Error posting a review!");
            }
          );
        }
      }
    }

  });