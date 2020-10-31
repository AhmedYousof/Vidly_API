const mongoose = require("mongoose");
const Joi = require("joi");

const genresSchema = mongoose.Schema({
  name: { type: String, minlenght: 5 , maxlength: 50 , required: true },
});

const Genre = mongoose.model("Genre", genresSchema);

function ValidateInput(genre) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
  };
  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.genresSchema = genresSchema;

exports.ValidateInput = ValidateInput;
