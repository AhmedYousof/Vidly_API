const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Genre } = require("../models/Genre");
const { Movie, ValidateInput } = require("../models/Movie");

router.post("/", async (req, res) => {
  const { error } = ValidateInput(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre...");
  let movie = new Movie({
    title: req.body.title,
    genre: genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  try {
    movie = await movie.save();
    res.status(200).send(movie);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }
});

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.status(200).send(movies);
});

module.exports = router;
