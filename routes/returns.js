const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { Rental } = require("../models/Rental");
const { Movie } = require("../models/Movie");
const Joi = require('joi')




router.post('/', [auth, validate(ValidateReturn)], async(req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) return res.status(404).send('Rental not found.');

    if (rental.dateReturned) return res.status(400).send('Return already processed.');
    
    rental.return();
    await rental.save();

    await Movie.update({_id: rental.movie._id}, {
        $inc: {numberInStock: 1}
    });
    res.send(rental);
});



function ValidateReturn(req) {
    const schema = {
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required(),
      
    };
    return Joi.validate(req, schema);
  }


module.exports = router;