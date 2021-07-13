var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// CONTROLLER IMPORTS
var controller = require("../controllers/phonezone.server.controller");
var infoController = require("../controllers/phonezone.server.infoController");
var searchController = require("../controllers/phonezone.server.searchController");
var authController = require("../controllers/phonezone.server.authController");
var cartController = require("../controllers/phonezone.server.cartController");
var checkoutController = require("../controllers/phonezone.server.checkoutController");

router.get("/", controller.home);
router.get("/getRequestExample", controller.getRequestExample);
// Getting phone info
router.get("/getPhones", controller.getPhones);
router.post("/createListing", jsonParser, controller.createListing);
router.post("/deleteListing", jsonParser, controller.deleteListing);
router.get("/getInfo", urlencodedParser, infoController.getInfo);
router.post("/togglePhone", jsonParser, infoController.togglePhone);
router.get("/searchPhones", urlencodedParser, searchController.searchPhones);
router.post("/postReview", jsonParser, infoController.postReview);


//Checkout related
router.get("/getAllCart", jsonParser, checkoutController.getAllCart);
router.get("/getQuantities", jsonParser, checkoutController.getQuantities);
router.post("/deletePhones", jsonParser, checkoutController.deletePhones);
router.post("/updateCartQuantity", jsonParser, checkoutController.updateCartQuantity);
router.post("/checkout", jsonParser, checkoutController.checkout);

// Login and sign-in related
router.post("/registerUser", jsonParser, authController.registerUser);
router.post("/loginUser", jsonParser, authController.loginUser);
router.get("/loginStatus", authController.getLoginStatus);
router.get("/logOut", authController.logout);

// Cart related
router.post("/addToCart", jsonParser, cartController.addToCart);
router.get("/getCartAmount",  urlencodedParser, cartController.getCartAmount);

// User related
router.get("/getUser", urlencodedParser, authController.getUser);
router.post("/updateUser", jsonParser, authController.updateUser);
router.post("/changePassword", jsonParser, authController.changePassword);
router.get("/getListings", urlencodedParser, authController.getListings);

module.exports = router;
