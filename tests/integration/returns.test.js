const mongoose = require('mongoose');
const {Rental} = require('../../models/Rental');
const {Movie} = require('../../models/Movie');
const {User} = require('../../models/User');
const request = require('supertest');
const moment = require('moment')


describe('/api/returns', () => {
    let server;
    let rental;
    let movieId;
    let customerId;
    let token;
    let movie;
   const exec = () => {
    return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({ customerId, movieId });
   }  

    beforeEach(async () => {
        server = require('../../App');

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();


        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: {name: '12345'},
            numberInStock: 10
        });
        await movie.save();


        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });
    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });
    
    // Return 401 if client is not logged in 
    // Return 400 if customerId is not provided

    it("Should return 401 if client is not logged in", async() => {
        token = " ";
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it("Should return 400 if customerId is not provided", async() => {
        customerId = "";

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it("Should return 400 if movieId is not provided", async() => {
        movieId = "";
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if return is already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();
    
        const res = await exec();
    
        expect(res.status).toBe(400);
      });

    it("Should return 404 rental not found.", async() => {
        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it("Should return 200 if we have a valid request.", async() => {

        const res = await exec();

        expect(res.status).toBe(200);
    });

    it("Should Set the returnDate if the input is valid", async() => {
         await exec();
        
        const rentalInDB = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDB.dateReturned; 
        expect(diff).toBeLessThan(10 * 1000);

    });

    it("Should return the rentalFee if the input is valid", async() => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        await exec();
       
       const rentalInDB = await Rental.findById(rental._id);
       expect(rentalInDB.rentalFee).toBe(14);
   });

   it("Should increase movie number In stock if the input is valid", async() => {
    await exec();
   
   const movieInDB = await Movie.findById(movieId);
   expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
});

it("Should return the rental if the input is valid", async() => {
    const res = await exec();
   
   expect(Object.keys(res.body)).toEqual(
       expect.arrayContaining(['dateOut','dateReturned','rentalFee', 'customer', 'movie'])
   );
});
    
})