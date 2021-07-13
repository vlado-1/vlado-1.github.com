angular
  .module("myApp")
  .controller("SearchController", function ($scope, $http, $routeParams) {
    $http({
      method: "GET",
      url: "/searchPhones",
      params: { title: $routeParams.title },
    }).then(
      function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        let phones = response["data"]["phones"];
        let brands = phones.map((phone) => phone.brand);

        $scope.phones = phones;
        $scope.brands = brands;

        let min = Math.min.apply(
          Math,
          phones.map(function (o) {
            return o.price;
          })
        );

        let max = Math.max.apply(
          Math,
          phones.map(function (o) {
            return o.price;
          })
        );
        $scope.maxPrice = max;
        $scope.minPrice = 0;

        $scope.visSlider = {
          options: {
            floor: 0,
            ceil: Math.round(max),
            step: 0,
          },
        };
      },
      function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("An error occurred!");
      }
    );
    $scope.selectBrand = function (brand) {
      // The phone id is injected into the url as a parameter to be retrieved
      $scope.selectedBrand = brand;
    };

    // Credit to https://stackoverflow.com/questions/24859420/filter-for-number-range-angularjs/27004527
    $scope.filterPrice = function (phone) {
      return phone.price >= $scope.minPrice && phone.price <= $scope.maxPrice;
    };

    // Info function that gets called when a row is clicked
    $scope.showInfo = function (phone) {
      // The phone id is injected into the url as a parameter to be retrieved
      window.location = "#/main/showInfo/" + phone["_id"];
    };
  });
