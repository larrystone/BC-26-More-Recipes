import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from './../app';

chai.use(chaiHttp);

let token;
let recipeId;

describe('/POST Create User and Recipe', () => {
  it('should create a user (to get token)', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .set('Accept', 'application/json')
      .send({
        name: 'Create Vote Tester',
        username: 'CreateVoteTester',
        email: 'createvotetester@test.com',
        password: 'testing'
      })
      .end((err, res) => {
        token = res.body.token;
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

  it('should create a recipe (to get recipeId)', (done) => {
    chai.request(app)
      .post('/api/v1/recipes')
      .set('Accept', 'application/json')
      .send({
        token,
        name: 'Test Recipe A',
        ingredients: 'Item1;;Item2;;Item3',
        procedure: 'procedure and procedure and procedures'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        done();
      });
  });
});

describe('/GET Upvotes/Downvotes on Recipe Test', () => {
  it('should return \'Nothing found\' for upvotes', (done) => {
    chai.request(app)
      .get(`/api/v1/recipes/${recipeId}/upvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.votes.length).to.equal(0);
        done();
      });
  });

  it('should return \'Nothing found\' for downvotes', (done) => {
    chai.request(app)
      .get(`/api/v1/recipes/${recipeId}/downvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.votes.length).to.equal(0);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Nothing found!');
        done();
      });
  });
});

describe('/POST upvote Review on recipe Test', () => {
  it(`should return \'Review upvoted\' for id ${recipeId}`, (done) => {
    chai.request(app)
      .post(`/api/v1/recipes/${recipeId}/upvotes`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).deep.equal({
          success: true,
          recipe: {
            downvotes: 0,
            upvotes: 1
          },
          message: `Recipe with id: ${recipeId} Upvoted!`
        });
        done();
      });
  });

  it(`should return \'Recipe already upvoted\' 
  for an already upvoted recipe`, (done) => {
      chai.request(app)
        .post(`/api/v1/recipes/${recipeId}/upvotes`)
        .set('Accept', 'application/json')
        .send({
          token
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(409);
          expect(res.body).deep.equal({
            success: false,
            message: 'Recipe already Upvoted!'
          });
          done();
        });
    });
});

describe('/GET Upvotes/Downvotes on Recipe Test', () => {
  it('should return an array of upvotes', (done) => {
    chai.request(app)
      .get(`/api/v1/recipes/${recipeId}/upvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.votes.length).to.equal(1);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('User upvotes found');
        done();
      });
  });

  it('should return \'Nothing found\'', (done) => {
    chai.request(app)
      .get(`/api/v1/recipes/${recipeId}/downvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Nothing found!');
        done();
      });
  });
});

describe('/POST downvote Review on recipe Test', () => {
  it(`should return \'Review downvoted\' for id: ${recipeId}`, (done) => {
    chai.request(app)
      .post(`/api/v1/recipes/${recipeId}/downvotes`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).deep.equal({
          success: true,
          recipe: {
            downvotes: 1,
            upvotes: 0
          },
          message: `Recipe with id: ${recipeId} Downvoted!`
        });
        done();
      });
  });

  it(`should return \'Review Already downvoted\'
  for an already downvoted recipe`, (done) => {
      chai.request(app)
        .post(`/api/v1/recipes/${recipeId}/downvotes`)
        .set('Accept', 'application/json')
        .send({
          token
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(409);
          expect(res.body).deep.equal({
            success: false,
            message: 'Recipe already Downvoted!'
          });
          done();
        });
    });

  it('should return \'Review downvoted\'', (done) => {
    chai.request(app)
      .post(`/api/v1/recipes/${recipeId + 1}/downvotes`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).deep.equal({
          success: true,
          recipe: {
            downvotes: 1,
            upvotes: 0
          },
          message: `Recipe with id: ${recipeId + 1} Downvoted!`
        });
        done();
      });
  });
});

describe('/GET Downvotes on Recipe Test', () => {
  it('should return an array of downvotes', (done) => {
    chai.request(app)
      .get(`/api/v1/recipes/${recipeId}/downvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.votes.length).to.equal(1);
        done();
      });
  });
});

describe('/POST upvote Review Test', () => {
  it('should return \'Review upvoted\'', (done) => {
    chai.request(app)
      .post(`/api/v1/recipes/${recipeId}/upvotes`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).deep.equal({
          success: true,
          recipe: {
            downvotes: 0,
            upvotes: 1
          },
          message: `Recipe with id: ${recipeId} Upvoted!`
        });
        done();
      });
  });
});

describe('/GET Upvotes/Downvotes on Recipe Test', () => {
  it('should return an array of upvotes', (done) => {
    chai.request(app)
      .get(`/api/v1/recipes/${recipeId}/upvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.votes.length).to.equal(1);
        done();
      });
  });

  it('should return \'Nothing found\' for' +
    'downvotes when none is found', (done) => {
    chai.request(app)
      .get(`/api/v1/recipes/${recipeId}/downvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Nothing found!');
        done();
      });
  });
});
