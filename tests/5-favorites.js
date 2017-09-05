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
        token = res.body.token;
        userId = res.body.userId;
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
        recipeId = res.body.id;
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        done();
      });
  });
});


describe('/POST Add recipe to favorites Test', () => {
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

