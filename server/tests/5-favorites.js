import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';

import server from './../app';

chai.use(chaiHttp);

let token;
let recipeId;
let userId;

describe('/POST Create User and Recipe', () => {
  it('should create a user (to get save token)', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .set('Accept', 'application/json')
      .send({
        name: 'Create Favorite Tester',
        username: 'CreateFavTester',
        email: 'createfavtester@test.com',
        password: 'testing'
      })
      .end((err, res) => {
        token = res.body.token;
        userId = jwt.decode(token).id;
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it('should create a recipe (to get recipeId)', (done) => {
    chai.request(server)
      .post('/api/v1/recipes')
      .set('Accept', 'application/json')
      .send({
        token,
        name: 'Test Recipe',
        ingredients: 'Item1;;Item2;;Item3',
        procedure: 'procedure and procedure and procedures'
      })
      .end((err, res) => {
        recipeId = res.body.recipe.id;
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        done();
      });
  });
});

describe('/GET user Favorite\'s Recipes Test', () => {
  it(`should return an array of Recipes for user id: ${userId}`, (done) => {
    chai.request(server)
      .get(`/api/v1/users/${userId}/recipes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});

describe('/POST Add recipe to favorites Test', () => {
  it('should return \'Invalid User ID!\'', (done) => {
    chai.request(server)
      .post(`/api/v1/users/${userId}/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .send({
        token: 'eyJNiJ9.c2Rz.H9g9SB2Uvbhj.hl50q3fbZQk' +
          '4yJfLBEJRzrcfeX2nqKl-8yIuI',
        name: 'Ewedu soup',
        ingredients: 'Water;;Ewedu leaves;;Salt',
        procedure: 'Light stove and just start cooking'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body).deep.equal({
          success: false,
          message: 'Failed to authenticate token.'
        });
        done();
      });
  });

  it(`should add recipe id: ${recipeId} to favorites`, (done) => {
    chai.request(server)
      .post(`/api/v1/users/${userId}/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it(`should return 'Recipe with id: ${recipeId} Already added!'`, (done) => {
    chai.request(server)
      .post(`/api/v1/users/${userId}/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(409);
        done();
      });
  });
});

describe('/GET user Favorite\'s Recipes Test', () => {
  it(`should return an array of Recipes for user id: ${userId}`, (done) => {
    chai.request(server)
      .get(`/api/v1/users/${userId}/recipes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('should return \'Invalid User ID for user id: \'abc\'', (done) => {
    chai.request(server)
      .get('/api/v1/users/abc/recipes')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        done();
      });
  });
});

describe('/GET Validate if recipe is a favorite Test', () => {
  it(`should return an array of Recipes for user id: ${userId}`, (done) => {
    chai.request(server)
      .get(`/api/v1/users/${userId}/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
});

describe('/POST Remove recipe from favorites Test', () => {
  it(`should remove recipe id: ${recipeId} from favorites`, (done) => {
    chai.request(server)
      .delete(`/api/v1/users/${userId}/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
});


describe('/GET User favorite recipe by ID Recipes Test', () => {
  it(`should return an array of Recipes for user id: ${userId}`, (done) => {
    chai.request(server)
      .get(`/api/v1/users/${userId}/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});
