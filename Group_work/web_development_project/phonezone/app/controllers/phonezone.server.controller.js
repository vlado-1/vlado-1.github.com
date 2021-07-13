var express = require("express");
var Phonelistings = require("../models/phonelistings");
var Users = require("../models/users");

function renameKey(obj, oldKey, newKey) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

// Mongo returned phones differ in format (key names) to what our
// frontend expects. This renames the keys
function phoneAdapter(phone) {
  var phoneClone = JSON.parse(JSON.stringify(phone));
  renameKey(phoneClone, "_id", "id");
  renameKey(phoneClone, "image", "imagePath");
  renameKey(phoneClone, "title", "name");
  return phoneClone;
}

function massAdaptPhones(phones) {
  let newPhones = [];
  phones.forEach((obj) => newPhones.push(phoneAdapter(obj)));
  return newPhones;
}

function home(req, res) {
  res.sendFile("index.html", { root: req.app.get("html") });
}

// Asynchronous function which calls the database if necessary,
// and awaits its response before rendering the home page.
async function getPhones(req, res) {
  // if (
  //   req.app.locals.soldOutSoon == null ||
  //   req.app.locals.bestSellers == null
  // ) {
  //   await queryFunctionWrapper(req);
  // }

  await queryFunctionWrapper(req);

  res.send({
    soldOutSoon: req.app.locals.soldOutSoon,
    bestSellers: req.app.locals.bestSellers,
  });
}

// Wrapper around a Promise to facilitate asynchronous requests.
// Credit to https://stackoverflow.com/questions/5010288/how-to-make-a-function-wait-until-a-callback-has-been-called-using-node-js
function queryFunctionWrapper(req) {
  return new Promise((resolve, reject) => {
    queryPhones(
      req,
      (successResponse) => {
        resolve(successResponse);
      },
      (errorResponse) => {
        reject(errorResponse);
      }
    );
  });
}

// Get the best sellers and selling out soon from DB
function queryPhones(req, successCallback, errorCallback) {
  // The functions are nested due to their asynchronous nature
  Phonelistings.getSoldOutSoon(function (err, result) {
    if (err) errorCallback(err);
    else {
      req.app.locals.soldOutSoon = massAdaptPhones(result);

      Phonelistings.getBestSeller(function (err, result) {
        if (err) errorCallback(err);
        else {
          req.app.locals.bestSellers = massAdaptPhones(result);
          successCallback();
        }
      });
    }
  });
}

function getRequestExample(req, res) {
  res.send({ hello: "This is a GET response." });
}

function createListing(req, res) {
  // Disallow users from creating listings they don't own
  if (req.session.userid == req.body["user"]) {
    Phonelistings.createListing(
      req.body["phone"],
      req.body["user"],
      function (err, result) {
        res.status(200).send();
      }
    );
  } else {
    res.status(401).send();
  }
}

function deleteListing(req, res) {
  // First confirm that the requester also owns the listing
  Phonelistings.getPhoneByID(req.body["phone"]["_id"], function (err, result) {
    if (result[0].seller["_id"] == req.session.userid) {
      console.log("Authorized");
      Phonelistings.deleteListing(req.body["phone"], function (err, result) {
        res.status(200).send();
      });
    } else {
      res.status(401).send();
    }
  });
}

module.exports = {
  home,
  massAdaptPhones,
  getRequestExample,
  getPhones,
  createListing,
  deleteListing,
};
