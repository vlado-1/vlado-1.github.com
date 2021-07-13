
var express = require('express');
var Users = require('../models/users.js');

// Middleware function to load cart data from DB into session store
function loadCart(req, res, next) {

    function loadResult(err, result) {
        if (err) {
            console.log("Problem loading cart from MongoDB Database.");
        }
        else {
            var cart = result[0]["cart"];
            for( let i = 0; i < cart.length; i++) {
                req.session.cart[cart[i]["phoneid"]] = cart[i]["quantity"];
            }
        }

        next();
    };

    
    Users.getUserCart(req.session.email, loadResult);
}

// Adds a single phone to the cart.
// Updates what Phones and quantity of Phones are in cart.
function addToCart(req, res) {
    var id = req.body["id"];
    var quantity = parseInt(req.body["qty"]);

    if (req.session.cart[id] == null){
        // Create new entry for phone
        req.session.cart[id] =  quantity;
    }
    else {
        // Update old entry for phone
        req.session.cart[id] +=  quantity;
    }

    Users.addUserCartItem(req.session.email, id, quantity, function(err, result) {
        if (err) {
            console.log("Error persisting cart content and updating mongodb.")
        }
        else {
            res.send({"cartQty": req.session.cart[id]});
        }
    });    
}


// Gets the qantity of a particular phone, that is in the cart.
function getCartAmount(req, res) {

    var cartAmount;
    if (req.session.cart == null) {
        cartAmount = null;
    }
    else {
        cartAmount = req.session.cart[req.query["id"]];
    }
    
    if (cartAmount == null) {
        res.send({"cartQty": 0});
    }
    else {
        res.send({"cartQty": cartAmount});
    }
}


module.exports = { addToCart, getCartAmount, loadCart };