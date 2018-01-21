import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';

import app from './../app';

chai.use(chaiHttp);

let token;
let recipeId;
let userId;

describe('/POST Create User and Recipe', () => {
  it('should create a new user (to get token)', (done) => {
    chai.request(app)
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

  it('should create a new recipe (to get recipeId)', (done) => {
    chai.request(app)
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
  it(`should return 'Nothing found!' for user id: ${userId}`, (done) => {
    chai.request(app)
      .get(`/api/v1/users/${userId}/recipes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal('Nothing found!');
        done();
      });
  });
});

describe('/POST Add recipe to favorites Test', () => {
  it(`should return 'Failed to authenticate token.' 
for invalid user token`, (done) => {
      chai.request(app)
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

  it(`should add recipe id: ${recipeId} to user favorites`, (done) => {
    chai.request(app)
      .post(`/api/v1/users/${userId}/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Recipe added to favorites!');
        done();
      });
  });

  it(`should return 'Recipe with id: ${recipeId} Already added!'`, (done) => {
    chai.request(app)
      .post(`/api/v1/users/${userId}/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(409);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Recipe already added!');
        done();
      });
  });
});

describe('/GET user Favorite\'s Recipes Test', () => {
  it(`should return an array of Recipes for user id: ${userId}`, (done) => {
    chai.request(app)
      .get(`/api/v1/users/${userId}/recipes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Favorite Recipes found');
        expect(res.body.recipes.length).to.equal(1);
        done();
      });
  });

  it('should return \'Invalid User ID for user id: \'abc\'', (done) => {
    chai.request(app)
      .get('/api/v1/users/abc/recipes')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid User ID!');
        done();
      });
  });
});

describe('/GET Validate if recipe is a favorite Test', () => {
  it(`should return an array of Recipes for user id: ${userId}`, (done) => {
    chai.request(app)
      .get(`/api/v1/users/${userId}/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Favorite Recipe found');
        done();
      });
  });
});

describe('/POST Remove recipe from favorites Test', () => {
  it(`should remove recipe id: ${recipeId} from favorites`, (done) => {
    chai.request(app)
      .delete(`/api/v1/users/${userId}/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to
          .equal(`Recipe with ID: ${recipeId} Removed from Favorites`);
        done();
      });
  });
});


describe('/GET User favorite recipes Test', () => {
  it(`should return an array of Recipes for user id: ${userId}`, (done) => {
    chai.request(app)
      .get(`/api/v1/users/${userId}/recipes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Nothing found!');
        expect(res.body.recipes.length).to.equal(0);
        done();
      });
  });
});
