var express = require("express");
var Phonelistings = require("../models/phonelistings");
var Users = require("../models/users");

function searchPhones(req, res) {
  Phonelistings.searchPhones(req.query["title"], function (err, result) {
    res.send({ phones: result });
  });
}

module.exports = { searchPhones };
