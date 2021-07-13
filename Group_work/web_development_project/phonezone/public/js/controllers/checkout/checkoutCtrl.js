
angular.module("myApp").controller("CheckoutController", function ($scope, $rootScope, $http,  $routeParams, $location, $route) {
	if (!$rootScope.signed_in) {
          $location.path("auth/");
    }
	
	$scope.phones = [];
	$scope.quantities = [];

  	$http({
  		method: "GET",
  		url: "/getAllCart",
  		}).then(
  		function successCallback(response) {
			console.log("successfully retrieved cart items for checkout page!");
			$scope.phones = (response["data"]["phones"]);

			$http({
				method: "GET",
				url: "/getQuantities",
				}).then(
				function successCallback(response) {
				  console.log("successfully retrived cart quantities for checkout page.");
				  $scope.quantities = response["data"]["quantities"];
				  for(var i = 0; i < $scope.phones.length; i++){
					  var phone_id = $scope.phones[i]._id;
					  $scope.phones[i].quantity = $scope.quantities[phone_id];
				  }
	  
				  // Calculate total price immediately
				  $scope.totalPrice = 0;
				  for (var i = 0; i < $scope.phones.length; i++) {
					  $scope.totalPrice += $scope.phones[i].price * $scope.phones[i].quantity;
				  }
			  },
			  function errorCallback(response) {
				  console.log("error retrieving cart quantities for checkout page.");
			});
    	},
    	function errorCallback(response) {
			console.log("Error getting cart items for checkout page!");
			alert("Error retrieving cart items for checkout page!");
    	}
  	);

 	$scope.checkout = function(phones){
 	
 		$http({
 			method: "POST",
 			url: "/checkout",
 			data: { phones: $scope.phones, },
 			}).then(
 				function successCallback(response){
 					console.log("checkout complete");
	 				alert("Checkout Success!");
					$location.path("/#");
 				},
 				function errorCallback(response){
 					console.log("an error occured during checkout");
					 alert("Checkout Failed! \n \nSome phone quantities were greater than what was in stock.");
 				}
		);
	}
  
	
  	//back button
	$scope.back = function(){
		window.history.back();
	}
	
   
 
   
  //when we want to change user owned phones by qty
  $scope.updateOwnedPhones = function(phone){
	if (phone.quantity == 0) {
		$scope.deleteUserPhone(phone);
	}
	else {
		$http({
			method: "POST",
			url: "/updateCartQuantity",
			data: { id: phone._id,
					qty: phone.quantity, },
		}).then(
			function successCallback(response) {
				// Recalculate price after quantity successfully changed
				$scope.totalPrice = 0;
				for (var i = 0; i < $scope.phones.length;i++){
					$scope.totalPrice += ($scope.phones[i].price * $scope.phones[i].quantity);
				}
			},
			function errorCallback(response) {
				console.log("An error occurred while updating cart!");
			}
		);
	}
  };
	
  //when delete button is pressed 
  $scope.deleteUserPhone = function(phone){	
  	
     $http({
  		method: "POST",
  		url: "/deletePhones",
  		data: { id: phone._id },
  		}).then(
  		function successCallback(response) {
  			
			// Find the index of the phone to remove
			var removedPhoneIdx = -1;
			for (var i = 0; i < $scope.phones.length; i++) {
				if ($scope.phones[i]._id === phone._id) {
					removedPhoneIdx = i;
					break;	
				}
			}

			// Delete phone being displayed
			$scope.phones.splice(removedPhoneIdx,1);

			// Calculate new total price
			$scope.totalPrice = 0;
			for (var i = 0; i < $scope.phones.length; i++) {
				$scope.totalPrice += $scope.phones[i].price * $scope.phones[i].quantity;
			}

    	},
    	function errorCallback(response) {
			console.log("error");
			
  		}
    	
 	);
  }
  

});
