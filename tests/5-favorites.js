import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from './../server/app';

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
        token = res.body.data.token;
        userId = res.body.data.userId;
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
        direction: 'direction and direction and directions'
      })
      .end((err, res) => {
        recipeId = res.body.data.id;
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
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
        token: 'eyJhbGciOiJIUzI1NiJ9.c2Rz.H9g9SB2U50q3fbZQk' +
        '4yJfLBEJRzrcfeX2nqKl-8yIuI',
        name: 'Ewedu soup',
        ingredients: 'Water;;Ewedu leaves;;Salt',
        direction: 'Light stove and just start cooking'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body).deep.equal({
          success: false,
          message: 'Invalid User ID!'
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
});

describe('/POST Remove recipe from favorites Test', () => {
  it(`should remove recipe id: ${recipeId} from favorites`, (done) => {
    chai.request(server)
      .delete(`/api/v1/users/${userId}/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(204);
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
        expect(res.statusCode).to.equal(201);
        done();
      });
  });
});
