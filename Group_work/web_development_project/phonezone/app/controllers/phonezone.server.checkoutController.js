var express = require("express");
var Phonelistings = require("../models/phonelistings");
var Users = require("../models/users");

var app = express();
//get all session phones to display on checkout page
function getAllCart(req, res) {
  console.log("using checkout controller");
  var cart = Object.keys(req.session.cart);
  Phonelistings.find({ _id: { $in: cart } })
    .then((result) => {
      res.send({ phones: result });
    })
    .catch((err) => {
      console.log(err);
    });
}

function getQuantities(req, res) {
  console.log("getting quantities");

  var cartCopy = {};
  Object.assign(cartCopy, req.session.cart);

  console.log("AM " + cartCopy);
  res.send({ quantities: cartCopy });
}

function updateCartQuantity(req, res) {
  function response(err, result){
    if (err){
      console.log("Error updating phone in mongoDB cart.");
      res.status(401).send();
    }
    else {
      console.log("Updating phone in cart");
      req.session.cart[req.body["id"]] = req.body["qty"];
      res.status("200").send();
    }
  }
  
  Users.updateUserCartItem(req.session.email, req.body["id"],req.body["qty"], response);
}

function deletePhones(req, res) {
  function response(err, result){
    if (err){
      console.log("Error deleting phone from mongoDB cart.");
      res.status(401).send();
    }
    else {
      console.log("Deleting phone from cart");
      delete req.session.cart[req.body["id"]];
      res.status(200).send();
    }
  }

  if (req.session.cart[req.body["id"]] != null) {
    Users.deleteUserCartItem(req.session.email, req.body["id"], response);
  }

}

function checkout(req, res) {
  console.log(req.body["phones"]);
  var phones = req.body["phones"];

  var cart = Object.keys(req.session.cart);
  Phonelistings.find({ _id: { $in: cart } }, {_id: 1, stock: 1}).exec(function(err, result) {
    
    // Check if all quantities within stock amount limit
    var stock_err = false;
    for (var i = 0; i < result.length; i++) {
      if (result[i]['stock'] <  req.session.cart[phones[i]._id]) {
        stock_err = true;
      }
    }

    if (stock_err) {
      res.status(409).send();
    }
    else {
      Users.clearUserCartItems(req.session.email, function(err, results){  
        if (err){
          res.status(409).send();
        }
        else {
          //updating db of phones and their stocks
          for (var i = 0; i < phones.length; i++) {
            Phonelistings.updateQuantity(
              phones[i]._id,
              req.session.cart[phones[i]._id]
            );
          }

          var i = 0;
          //clearing session cart
          while (req.body["phones"].length > i) {
            console.log("deleting phone from the cart " + req.body["phones"][i]._id);
            delete req.session.cart[req.body["phones"][i]._id];
            i++;
          }

          console.log(req.session.cart);
          res.status(200).send();
        }
      })
    }
    });
}

module.exports = {
  getAllCart,
  getQuantities,
  updateCartQuantity,
  deletePhones,
  checkout,
};
