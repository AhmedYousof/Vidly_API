const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require('../middleware/validateObjectId');
const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const { Genre, ValidateInput } = require("../models/Genre");

router.get("/", async (req, res, next) => {
  //throw new Error("Couldn't get the genres");
  const genres = await Genre.find({});
  res.status(200).send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    return res.status(404).send("The genre with the given ID does not exist");
  }
  res.status(200).send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = ValidateInput(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let genre = new Genre({
    name: req.body.name,
  });
  genre = await genre.save();
  res.status(200).send(genre);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = ValidateInput(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  };

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) {
    return res.status(404).send("The genre with the given ID does not exist");
  };

  res.status(200).send(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) {
    return res.status(404).send("The genre with the given ID does not exist");
  }

  res.send(genre);
});

module.exports = router;
