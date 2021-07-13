var mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost/phonezone",
  { useNewUrlParser: true },
  function () {
    console.log("mongodb connected");
  },
  { useUnifiedTopology: true }
);

module.exports = mongoose;
