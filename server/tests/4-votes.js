import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from './../app';

chai.use(chaiHttp);

let token;
let recipeId;

describe('/POST Create User and Recipe', () => {
  it('should create a user (to get save token)', (done) => {
    chai.request(server)
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

  it('should create a recipe (to get recipeId)', (done) => {
    chai.request(server)
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
  it('should return an empty array of upvotes', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId}/upvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('should return an empty array of downvotes', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId}/downvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
});

describe('/POST upvote Review Test', () => {
  it('should return \'Review upvoted\'', (done) => {
    chai.request(server)
      .post(`/api/v1/recipes/${recipeId}/upvotes`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).deep.equal({
          success: true,
          message: `Recipe with id: ${recipeId} Upvoted!`
        });
        done();
      });
  });

  it('should return \'Recipe Already upvoted\'', (done) => {
    chai.request(server)
      .post(`/api/v1/recipes/${recipeId}/upvotes`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(409);
        expect(res.body).deep.equal({
          success: false,
          message: `Recipe with id: ${recipeId} Already Upvoted!`
        });
        done();
      });
  });
});

describe('/GET Upvotes/Downvotes on Recipe Test', () => {
  it('should return an array of upvotes', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId}/upvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it('should return an empty array of downvotes', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId}/downvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
});

describe('/POST downvote Review Test', () => {
  it('should return \'Review downvoted\'', (done) => {
    chai.request(server)
      .post(`/api/v1/recipes/${recipeId}/downvotes`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).deep.equal({
          success: true,
          message: `Recipe with id: ${recipeId} Downvoted!`
        });
        done();
      });
  });

  it('should return \'Review Already downvoted\'', (done) => {
    chai.request(server)
      .post(`/api/v1/recipes/${recipeId}/downvotes`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(409);
        expect(res.body).deep.equal({
          success: false,
          message: `Recipe with id: ${recipeId} Already Downvoted!`
        });
        done();
      });
  });

  it('should return \'Review downvoted\'', (done) => {
    chai.request(server)
      .post(`/api/v1/recipes/${recipeId + 1}/downvotes`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).deep.equal({
          success: true,
          message: `Recipe with id: ${recipeId + 1} Downvoted!`
        });
        done();
      });
  });
});

describe('/GET Downvotes on Recipe Test', () => {
  it('should return am array of downvotes', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId}/downvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });
});

describe('/POST upvote Review Test', () => {
  it('should return \'Review upvoted\'', (done) => {
    chai.request(server)
      .post(`/api/v1/recipes/${recipeId}/upvotes`)
      .set('Accept', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).deep.equal({
          success: true,
          message: `Recipe with id: ${recipeId} Upvoted!`
        });
        done();
      });
  });
});

describe('/GET Upvotes/Downvotes on Recipe Test', () => {
  it('should return an array of upvotes', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId}/upvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it('should return am empty array of downvotes', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId}/downvotes`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
});
