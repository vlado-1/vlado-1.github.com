var Phonelistings = require("../models/phonelistings");
var Users = require("../models/users.js");

function getInfo(req, res) {
  Phonelistings.getPhoneByID(req.query["id"], function (err, result) {
    if (err) errorCallback(err);
    else {
      res.send({ phone: result });
    }
  });
}

function togglePhone(req, res) {
  Phonelistings.toggleStatus(req.body["id"], function (err, result) {
    console.log("info ctrl done!");
  });
}

function postReview(req, res) {
  Users.findUser(req.session.email, function(err, result){
    Phonelistings.addPhoneReview(result[0]["_id"], req.body["phoneid"], req.body["rating"], req.body["review"], function (err, result){
      if (err) {
        res.status(401).send();
      }
      else {
        res.status(200).send();
      }
    });
  });
}

module.exports = { getInfo, togglePhone, postReview };
