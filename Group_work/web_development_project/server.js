/**
 * The file to start a server
 *
 */
var session = require('express-session');
var express = require("express");
var path = require("path");
var app = express();

var router = require("./phonezone/app/routes/pz.server.routes.js");
const { loadCart } = require('./phonezone/app/controllers/phonezone.server.cartController.js');

app.set("html", path.join(__dirname, "/phonezone/public/html"));

app.use(express.static(path.join(__dirname, "/phonezone/public")));

// Create session and send cookie (expires in 2 minute) to website
// when the user first visits. This session is always set, both before
// a user logs in, and after they log out.
app.use(session({
  secret: ""+Math.random(),
  cookie: {maxAge: 120000},
  resave: true,
  saveUninitialized: true
}));

// Initialize session data
app.use("/", function(req, res, next) {
  // Initialize session data
  if (req.session != null) {
    if (req.session.cart == null) {
      // Cart = { (phone_id: qty) }
      req.session.cart = null;
    }
    if (req.session.user == null) {
      req.session.user = "none";
    }
    if (req.session.email == null) {
      req.session.email = "none";
    }
    if (req.session.signed_in == null) {
      req.session.signed_in = false;
    }
  }
  next(); 
});

app.use("/", function(req, res, next){
  if (req.session.signed_in && req.session.cart == null) {
    req.session.cart = {};
    loadCart(req, res, next);
  }
  else {
    next();
  }
});

app.use("/", router);

app.listen(3000, function () {
  console.log("PhoneZone app listening on port 3000!");
});

module.exports = app;
