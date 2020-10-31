const request = require('supertest');
const { Genre } = require('../../models/Genre');
const { User } = require('../../models/User');
const mongoose = require('mongoose');

let server;


describe('/api/genres', () => {
beforeEach(() => { server = require('../../App');})
afterEach( async()=> {
    await Genre.remove({});
    await server.close();
});

describe("GET /", () => {
    it("Should return all genres", async() => {
        const genres = [
            { name: 'genre1' },
            { name: 'genre2' },
          ];
          
          await Genre.collection.insertMany(genres);
       
        const res = await request(server).get('/api/genres');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body.some(g => g.name ==="genre1")).toBeTruthy();
        expect(res.body.some(g => g.name ==="genre2")).toBeTruthy();

    });
    
}); 

describe("GET /:id", () => {

    it("Should return the valid genre by Id", async() => {
        const genre = new Genre({name:"genre 3"});
        await genre.save();

        const res = await request(server).get('/api/genres/'+ genre._id);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', genre.name);
    });

    it("Should return 404 if invalid Id passed!", async() => {

        const res = await request(server).get('/api/genres/1');
        expect(res.status).toBe(404);
        //expect(res.body).toHaveProperty('name',genre.name)
    });

    it('should return 404 if no genre with the given id exists', async () => {
        const id = mongoose.Types.ObjectId();
        const res = await request(server).get('/api/genres/' + id);
  
        expect(res.status).toBe(404);
      });

});

describe("POST /", () => {

    let token;
    let name;

    const exec = async () => {
        return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({name});
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
        name = "genre1";
    })
     
    it("Should return 401 if client is not logged in", async() => {
        token = ''
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it("Should return 400 if genre is less than 5 characters", async() => {
        name ='1234'
        const res = await exec();
    
        expect(res.status).toBe(400);
    });

    it("Should return 400 if genre is more than 50 characters", async() => {
         name =new Array(52).join('a');
        const res = await exec();
    
        expect(res.status).toBe(400);
    });

    it("Should save the genre if it is valid", async() => {
        await exec();
        const genre = await Genre.find({name: 'genre'});
        
        expect(genre).not.toBeNull();
    });

    it("Should return the genre if it is valid", async() => {

    const res = await exec();        
        
       expect(res.body).toHaveProperty('_id');
       expect(res.body).toHaveProperty('name', 'genre1');
    });

});

describe("PUT /", () => {

    let token;
    let genre;
    let newName;
    let id;

    const exec = async () => {
       
        return await request(server)
        .put('/api/genres/'+ id)
        .set('x-auth-token', token)
        .send({name: newName});
    };

    beforeEach( async() => {
        genre = new Genre({ name: 'genre1' });
        await genre.save();
      
        token = new User().generateAuthToken();     
        id = genre._id; 
        newName = 'updatedName'; 
    });    

    it("Should return 401 if client is not logged in", async() => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    })

    
    it("Should return 400 if genre is less than 5 characters", async() => {
        newName ='1234';
        const res = await exec();
    
        expect(res.status).toBe(400);
    });
    it("Should return 400 if genre is more than 50 characters", async() => {
        newName =new Array(52).join('a');
       const res = await exec();
   
       expect(res.status).toBe(400);
   });
   it("should return 404 if id is invalid", async () => {
    id = 1;

    const res = await exec();

    expect(res.status).toBe(404);
    
});
   it("Should return the updated name if it is valid", async() => {
        const res = await exec();
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name', newName);
   });
});
describe("DELETE /", () => {
    let token;
    let genre;
    let id;

    const exec = async () => {
       
        return await request(server)
        .delete('/api/genres/'+ id)
        .set('x-auth-token', token)
        .send();
    };

    beforeEach( async() => {
        genre = new Genre({ name: 'genre1' });
        await genre.save();
      
        id = genre._id; 
        token = new User({ isAdmin: true }).generateAuthToken();     

    });

    it("should return 401 if client is not logged in", async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401)
    });

    it("should return 403 if usr is not Admin", async () => {
        token = new User({ isAdmin: false }).generateAuthToken(); 

        const res = await exec();

        expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
        id = 1;

        const res = await exec();

        expect(res.status).toBe(404);
        
    });

    it("should return 404 if no genre with the given id was found", async () => {
        id = mongoose.Types.ObjectId();

        const res = await exec();

        expect(res.status).toBe(404);
        
    });

    it("should delete the genre if input is valid", async () => {   
        await exec();

        const genreInDB = await Genre.findById(id);

        expect(genreInDB).toBeNull();
    });
    
    it("should return the removed genre", async () => {   
        const res = await exec();
        
        expect(res.body).toHaveProperty('_id', genre._id.toHexString());
        expect(res.body).toHaveProperty('name', genre.name);

    });
});
});
