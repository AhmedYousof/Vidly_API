const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: { type: String, required: true, minlength: 6, maxlength: 1024 },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function ValidateInput(genre) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().min(6).max(1024).required(),
  };
  return Joi.validate(genre, schema);
}

exports.User = User;

exports.ValidateInput = ValidateInput;
