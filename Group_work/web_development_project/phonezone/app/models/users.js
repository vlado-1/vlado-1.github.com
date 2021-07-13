/**
 *
 */
var mongoose = require("./db");

const CartItemSchema = new mongoose.Schema(
  {
    phoneid: String,
    quantity: Number,
  },
  {
    versionKey: false
  }
);

var UserSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    cart: [CartItemSchema],
  },
  {
    versionKey: false,
  }
);

UserSchema.statics.addUserCartItem = function(email, phoneid, quantity, callback) {
  this.updateOne({email:email}, {$push: {cart: {phoneid: phoneid, quantity: quantity}}}).exec(callback);
}

UserSchema.statics.getUserCart = function(email, callback) {
  this.find({email: email}, {cart: 1}).exec(callback);
}

UserSchema.statics.deleteUserCartItem = function(email, phoneid, callback) {
  this.updateOne({email: email}, {$pull: {cart: {phoneid: phoneid}}}).exec(callback);
}

UserSchema.statics.updateUserCartItem = function(email, phoneid, quantity, callback){
  this.updateOne({email: email, "cart.phoneid": phoneid}, {$set: {"cart.$.quantity": quantity}}).exec(callback);
}

UserSchema.statics.clearUserCartItems = function(email, callback) {
  this.updateOne({email: email}, {$set: {cart: []}}).exec(callback);
}

UserSchema.statics.findUser = function (email, callback) {
  return this.find({ email: email }).exec(callback);
};

UserSchema.statics.loginUser = function (email, password, callback) {
  return this.find({ email: email, password: password }).exec(callback);
};

UserSchema.statics.createUser = async function (
  fName,
  lName,
  email,
  password,
  callback
) {
  this.find({ email: email }).exec(function(err, result) {
    if (result.length > 0) {
    
      callback(409);
    
    } else {
      
      let user = {
        firstname: fName,
        lastname: lName,
        email: email,
        password: password,
      };
      user = new Users(user);      
      Users.create(user, function(err, result) {
        Users.find({ email: email }).exec(callback);
      });
    }
  });
};

UserSchema.statics.updateUser = async function (
  fName,
  lName,
  email,
  password,
  requester_id,
  callback
) {
  let users = await Users.find({ email: email });
  let user = await Users.findOne({ _id: requester_id });

  // Ensure no two users share an email
  if (users.length == 1 && users[0]._id != requester_id) {
    callback(409);
  } else {
    // Ensure only the owner can change their details
    console.log(user["_id"]);
    console.log(requester_id);

    if (user["_id"] == requester_id) {
      if (!(password === user["password"])) {
        callback(401);
      } else {
        user["firstname"] = fName;
        user["lastname"] = lName;
        user["email"] = email;
        user.save();
        callback(200);
      }
    } else {
      callback(403);
    }
  }
};

UserSchema.statics.changePassword = async function (
  currentPwd,
  newPwd,
  email,
  callback
) {
  let user = (await Users.find({ email: email }))[0];

  if (!(currentPwd === user["password"])) {
    callback(401);
  } else {
    console.log("Accepted");
    user["password"] = newPwd;
    user.save();
    callback(200);
  }
};

var Users = mongoose.model("Users", UserSchema, "users");

module.exports = Users;
