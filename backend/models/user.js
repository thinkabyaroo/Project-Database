const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, "shhhhh");
  return token;
};

module.exports = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
