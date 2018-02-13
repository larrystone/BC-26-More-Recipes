import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from './../../app';
import { Downvote, Upvote } from '../../models';
import {
  insertUserSeed, user1token, insertRecipeSeed
} from '../../seedData/testSeedData';

chai.use(chaiHttp);

let token;
const recipeId = 1;

describe('Vote Controller', () => {
  before((done) => {
    Downvote.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true
    });
    Upvote.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
      .then(() => {
        insertUserSeed();
        insertRecipeSeed();
        token = user1token;
        done();
      });
  });

  describe('/GET Upvotes/Downvotes on Recipe', () => {
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

  describe('/POST upvote Review on recipe', () => {
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

  describe('/GET Upvotes/Downvotes on Recipe', () => {
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

  describe('/POST downvote Review on recipe', () => {
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

  describe('/GET Downvotes on Recipe', () => {
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

  describe('/POST upvote Review', () => {
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

  describe('/GET Upvotes/Downvotes on Recipe', () => {
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
});
