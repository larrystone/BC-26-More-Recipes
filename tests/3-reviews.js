import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from './../server/app';

chai.use(chaiHttp);

let token;
let recipeId;

describe('/POST Create User and Recipe', () => {
  it('should create a user (to get save token)', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .set('Accept', 'application/json')
      .send({
        name: 'Create Review Tester',
        username: 'CreateReviewTester',
        email: 'createreviewtester@test.com',
        password: 'testing'
      })
      .end((err, res) => {
        token = res.body.token;
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


describe('/POST Review Test', () => {
  it('should create and return a review', (done) => {
    chai.request(server)
      .post(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .send({
        token,
        content: 'This is a test review 1'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it('should create and return a review', (done) => {
    chai.request(server)
      .post(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .send({
        token,
        content: 'This is a test review 2'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it('should create and return a review', (done) => {
    chai.request(server)
      .post(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .send({
        token,
        content: 'This is a test review 3'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it('should create and return a review', (done) => {
    chai.request(server)
      .post(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .send({
        token,
        content: 'This is a test review 4'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it('should create and return a review', (done) => {
    chai.request(server)
      .post(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .send({
        token,
        content: 'This is a test review 5'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });
});

describe('/GET all Reviews on a Recipe Test', () => {
  it('should return an array of Reviews', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });
});