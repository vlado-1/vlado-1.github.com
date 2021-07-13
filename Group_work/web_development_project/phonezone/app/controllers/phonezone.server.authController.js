var Users = require("../models/users");
var express = require("express");
var Phonelistings = require("../models/phonelistings");

// Try to create user if they do not already exist.
function registerUser(req, res) {
  Users.createUser(
    req.body["fName"],
    req.body["lName"],
    req.body["email"],
    req.body["password"],
    function (err, result) {
      console.log(result);
      var status = 409;
      if (result.length > 0) {
        req.session.signed_in = true;
        req.session.user = req.body["fName"] + " " + req.body["lName"];
        req.session.email = req.body["email"];
        req.session.userid = result[0]["_id"];
        status = 201;
      }
      res.status(status).send();
    }
  );
}

// Try to login as a user if the username and password exist.
function loginUser(req, res) {
  Users.loginUser(
    req.body["email"],
    req.body["password"],
    function (err, result) {
      var status;
      if (result.length > 0) {
        status = 201;
      } else {
        status = 409;
      }

      if (status == 201) {
        req.session.signed_in = true;
        req.session.user = result[0]["firstname"] + " " + result[0]["lastname"];
        req.session.email = req.body["email"];
        req.session.userid = result[0]["_id"];
      }
      res.status(status).send();
    }
  );
}

function getUser(req, res) {
  Users.findUser(req.query["email"], function (err, result) {
    res.send({ user: result[0] });
  });
}

function updateUser(req, res) {
  Users.updateUser(
    req.body["fName"],
    req.body["lName"],
    req.body["email"],
    req.body["password"],
    req.session.userid,
    function (result) {
      if (result == 200) {
        console.log(req.body);
        req.session.user = req.body["fName"] + " " + req.body["lName"];
        req.session.email = req.body["email"];
      }
      res.status(result).send();
    }
  );
}

// Get users name and login status.
function getLoginStatus(req, res) {
  res.send({
    status: req.session.signed_in,
    user: req.session.user,
    userid: req.session.userid,
    email: req.session.email,
  });
}

// Destroy the user session so that server forgets about the user.
// Note: The server will likely create a new empty session automatically afterwards
//       due to the server.js code.
function logout(req, res) {
  req.session.destroy(function (err) {
    res.send({ logout: true });
  });
}

function changePassword(req, res) {
  // Prevent users from changing others' passwords..!
  if (req.body["email"] == req.session.email) {
    Users.changePassword(
      req.body["currentPwd"],
      req.body["newPwd"],
      req.body["email"],
      function (result) {
        res.status(result).send();
      }
    );
  } else {
    res.status(401).send();
  }
}

function getListings(req, res) {
  Phonelistings.getUserListings(req.query["userId"], function (err, result) {
    console.log(result);
    res.send({ phones: result });
  });
}

module.exports = {
  registerUser,
  getUser,
  updateUser,
  changePassword,
  getListings,
  loginUser,
  getLoginStatus,
  logout,
};
