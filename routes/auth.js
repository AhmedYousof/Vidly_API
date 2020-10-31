const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const { User } = require("../models/User");

router.post("/", async (req, res) => {
  const { error } = ValidateInput(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Email or Password...");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid Email or Password...");
  const token = user.generateAuthToken();
  res.send(token);
});

function ValidateInput(genre) {
  const schema = {
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().min(6).max(1024).required(),
  };
  return Joi.validate(genre, schema);
}
module.exports = router;
