/**
 *
 */
var mongoose = require("./db");
var Users = require("./users");

const ReviewSchema = new mongoose.Schema(
  {
    reviewer: { type: String, ref: "Users" },
    rating: Number,
    comment: String,
  },
  { versionKey: false }
);

var PhonelistingsSchema = new mongoose.Schema(
  {
    title: String,
    brand: String,
    image: String,
    stock: Number,
    seller: { type: String, ref: "Users" },
    price: Number,
    reviews: [ReviewSchema],
    enabled: { type: Boolean, default: true },
  },
  {
    versionKey: false,
  }
);

// Name: Sold Out Soon Query
// Description: Finds 5 phones with the least amount of stock.
//              Stock must be greater than 0 and phones must not
//              be disabled.
// Input: Callback function
// Returns: Collection [Phones], where each Phone = (title, image, price) tuple
PhonelistingsSchema.statics.getSoldOutSoon = function (callback) {
  return this.find({ stock: { $gt: 0 }, enabled: true })
    .sort({ stock: 1 })
    .limit(5)
    .exec(callback);
};

// Name: Best Seller Query
// Description: Finds 5 phones with highest average rating.
//              At least 2 ratings must have been given for
//              each phone and phones must not be disabled.
// Input: Callback function
// Returns: Collection [Phones]
PhonelistingsSchema.statics.getBestSeller = function (callback) {
  console.log("Querying best seller.");
  return this.aggregate([
    {
      $match: {
        $expr: { $gt: [{ $size: "$reviews" }, 1] },
        enabled: true,
        stock: { $gt: 0 }
      },
    },
    { $unwind: "$reviews" },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        image: { $first: "$image" },
        avg_rating: { $avg: "$reviews.rating" },
        brand: { $first: "$brand" },
        stock: { $first: "$stock" },
        price: { $first: "$price" },
        seller: { $first: "$seller" },
        reviews: { $push: "$reviews" },
      },
    },
    // { $project: { title: "$_id", image: 1, price: 1 } },
    {
      $project: {
        _id: 1,
        title: 1,

        image: 1,
        avg_rating: 1,
        brand: 1,
        stock: 1,
        price: 1,
        seller: 1,
        reviews: 1,
      },
    },
    { $sort: { avg_rating: -1 } },
    { $limit: 5 },
  ]).exec(callback);
};

// Name: Search Query
// Description: Finds all phones for which the search text
//              matches any part of the title (case insensitive).
//              Phones must not be disabled.
// Input: Search Text, Callback function
// Returns: Collection [Phones], where each Phone = (title, image, price) tuple
PhonelistingsSchema.statics.searchPhones = function (text, callback) {
  return this.find({
    title: { $regex: text, $options: "i" },
    enabled: true,
  })
    .sort({ price: -1 })
    .exec(callback);
};

// Name: Phone Item Query
// Description: Get all data associated with a given phone title.
// Input: Phone Title, Callback function
// Returns: Collection [Phones],
//          where each Phone is a tuple containing all schema
//          fields.
PhonelistingsSchema.statics.getPhone = function (title, callback) {
  return this.find({ title: title }).exec(callback);
};

PhonelistingsSchema.statics.getPhoneByID = function (id, callback) {
  return this.find({ _id: id })
    .populate("seller")
    .populate("reviews.reviewer")
    .exec(callback);
};
PhonelistingsSchema.statics.getUserListings = function (userId, callback) {
  return this.find({ seller: userId }).exec(callback);
};

PhonelistingsSchema.statics.toggleStatus = async function (id, callback) {
  const phone = await this.findOne({ _id: id }).exec();

  phone["enabled"] = !phone["enabled"];
  phone.save();
  callback(200);
};

PhonelistingsSchema.statics.createListing = function (phone, user, callback) {
  phone["seller"] = user;
  phone["image"] = "/images/" + phone["brand"] + ".jpeg";
  this.create(phone);
  callback(200);
};

PhonelistingsSchema.statics.deleteListing = function (phone, callback) {
  this.deleteOne({ _id: phone["_id"] }).exec(callback);
};

PhonelistingsSchema.statics.updateQuantity = async function (id, qty) {
  const phone = await this.findOne({ _id: id }).exec();

  amount = phone["stock"] - qty;
  phone["stock"] = amount;
  phone.save();
};

PhonelistingsSchema.statics.addPhoneReview = function (userid, phoneid, rating, review, callback) {
  this.updateOne({_id: phoneid}, {$push:  {reviews: {reviewer: userid, rating: rating, comment: review}}}).exec(callback);
}

var Phonelistings = mongoose.model(
  "Phonelistings",
  PhonelistingsSchema,
  "phonelistings"
);

// Update the data set to include proper image URLs
Phonelistings.find({}, function (err, results) {
  for (var i = 0; i < results.length; i++) {
    doc = results[i];
    var brand = doc.brand;
    doc.image = "/images/" + brand + ".jpeg";
    doc.save();
  }
});

module.exports = Phonelistings;
