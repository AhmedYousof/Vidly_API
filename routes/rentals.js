const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Rental, ValidateInput } = require("../models/Rental");
const { Movie } = require("../models/Movie");
const { Customer } = require("../models/Customer");
const c = require("config");
const Fawn = require("fawn");
const auth = require('../middleware/auth');

Fawn.init(mongoose);
router.post("/", auth, async (req, res) => {
  const { error } = ValidateInput(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid Customer...");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid Movie...");
  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not In Stock...");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.status(200).send(rental);
  } catch (ex) {
    res.status(500).send("Something failed...");
  }
});

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.status(200).send(movies);
});

module.exports = router;
