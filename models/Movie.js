const mongoose = require("mongoose");
const Joi = require("joi");
const { genresSchema } = require("./Genre");

const movieSchema = mongoose.Schema({
  title: String,
  genre: genresSchema,
  numberInStock: Number,
  dailyRentalRate: Number,
});
const Movie = mongoose.model("Movie", movieSchema);

function ValidateInput(genre) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  };
  return Joi.validate(genre, schema);
}

exports.Movie = Movie;

exports.ValidateInput = ValidateInput;
