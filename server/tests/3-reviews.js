import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';

import app from './../app';

chai.use(chaiHttp);

let token;
let recipeId;
let userId;

describe('/POST Create User and Recipe', () => {
  it('should create a user (to get token)', (done) => {
    chai.request(app)
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
        userId = jwt.decode(token).id;
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it('should create a recipe (to get recipeId)', (done) => {
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

describe('/GET all Reviews on a Recipe Test', () => {
  it('should return \'Nothing found!\' when no recipe is found', (done) => {
    chai.request(app)
      .get(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal('Nothing found!');
        done();
      });
  });
});

describe('/GET all Reviews by a User Test', () => {
  it('should return \'Nothing found!\' when no recipe is found', (done) => {
    chai.request(app)
      .get(`/api/v1/users/${userId}/reviews`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal('Nothing found!');
        done();
      });
  });
});


describe('/POST Review Test', () => {
  it('should return \'Review message too short!\'' +
    'for review length < 5 ', (done) => {
    chai.request(app)
      .post(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .send({
        token,
        content: 'hmm'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).deep.equal({
          success: false,
          message: 'Review message too short!'
        });
        done();
      });
  });

  it('should return \'Review message too short!\' for null review', (done) => {
    chai.request(app)
      .post(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .send({
        token,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).deep.equal({
          success: false,
          message: 'Review message too short!'
        });
        done();
      });
  });

  it('should create and return a review on recipe', (done) => {
    chai.request(app)
      .post(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .send({
        token,
        content: 'This is a test review 1'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.createdReview.content)
          .to.equal('This is a test review 1');
        done();
      });
  });

  it('should create and return a review on recipe', (done) => {
    chai.request(app)
      .post(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .send({
        token,
        content: 'This is a test review 2'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.createdReview.content)
          .to.equal('This is a test review 2');
        done();
      });
  });

  it('should create and return a review on recipe', (done) => {
    chai.request(app)
      .post(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .send({
        token,
        content: 'This is a test review 3'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.createdReview.content)
          .to.equal('This is a test review 3');
        done();
      });
  });

  it('should create and return a review on recipe', (done) => {
    chai.request(app)
      .post(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .send({
        token,
        content: 'This is a test review 4'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.createdReview.content)
          .to.equal('This is a test review 4');
        done();
      });
  });

  it('should create and return a review on recipe', (done) => {
    chai.request(app)
      .post(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .send({
        token,
        content: 'This is a test review 5'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.createdReview.content)
          .to.equal('This is a test review 5');
        done();
      });
  });
});

describe('/GET all Reviews on a Recipe Test', () => {
  it('should return an array of Reviews', (done) => {
    chai.request(app)
      .get(`/api/v1/recipes/${recipeId}/reviews`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.reviews.length).to.equal(5);
        done();
      });
  });
});

describe('/GET all Reviews by a User Test', () => {
  it('should return an array of Reviews', (done) => {
    chai.request(app)
      .get(`/api/v1/users/${userId}/reviews`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.reviews.length).to.equal(5);
        done();
      });
  });
});
