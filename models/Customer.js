const mongoose = require("mongoose");
const Joi = require("joi");

const customersSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 255 },
  phone: { type: String, required: true, minlength: 5, maxlength: 25 },
  isGold: { type: Boolean, required: true },
});
const Customer = mongoose.model("Customer", customersSchema);

function ValidateInput(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(5).required(),
    isGold: Joi.boolean(),
  };
  return Joi.validate(genre, schema);
}

exports.Customer = Customer;

exports.ValidateInput = ValidateInput;
