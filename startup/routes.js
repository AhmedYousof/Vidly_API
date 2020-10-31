const express = require("express");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const returns = require("../routes/returns");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const index = require("../routes/index");
const morgan = require("morgan");
const helmet = require("helmet");

const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.use(helmet());
  app.use("/api/genres", genres);
  app.use("/api/returns", returns);
  app.use("/api/customers", customers);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/", index);
  app.use(error);
};
