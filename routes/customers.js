const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Customer, ValidateInput } = require("../models/Customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find({});
  res.status(200).send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res
      .status(404)
      .send("The customer with the given ID does not exist");
  }
  res.status(200).send(customer);
});

router.post("/", async (req, res) => {
  const { error } = ValidateInput(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  try {
    customer = await customer.save();
    res.status(200).send(customer);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }
});
/*
router.put("/:id", async (req, res) => {
  const { error } = ValidateInput(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!customer) {
    return res
      .status(404)
      .send("The customer with the given ID does not exist");
  }

  res.status(200).send(customer);
});
*/
/*router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) {
    return res
      .status(404)
      .send("The customer with the given ID does not exist");
  }

  res.send(customer);
});
*/

module.exports = router;
