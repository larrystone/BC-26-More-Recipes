import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import { Recipe } from '../../models';

import app from './../../app';

import {
  insertUserSeed, user1token, insertRecipeSeed, inserReviewSeed
} from '../../seedData/testSeedData';

chai.use(chaiHttp);

let token;
const recipeId = 1;
const userId = 1;


describe('Review Controller', () => {
  before((done) => {
    Recipe.destroy({
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

  describe('/GET all Reviews on a Recipe', () => {
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

  describe('/GET all Reviews by a User', () => {
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


  describe('/POST Review', () => {
    before(() => {
      inserReviewSeed();
    });
    it(`should return \'Review message must be between 3 to 4000 characters!\'
for "ok" `, (done) => {
        chai.request(app)
          .post(`/api/v1/recipes/${recipeId}/reviews`)
          .set('Accept', 'application/json')
          .send({
            token,
            content: 'hm'
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).deep.equal({
              success: false,
              message: 'Review message must be between 3 to 4000 characters!'
            });
            done();
          });
      });

    it(`should return \'Review message must be between 3 to 4000 characters!\' 
for null review`,
      (done) => {
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
              message: 'Review message must be between 3 to 4000 characters!'
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
  });

  describe('/GET all Reviews on a Recipe', () => {
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

  describe('/GET all Reviews by a User', () => {
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
});
