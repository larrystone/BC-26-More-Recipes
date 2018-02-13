import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import * as Encryption from './../../../server/middleware/encryption';

import app from './../../app';

const newEncrytion = new Encryption.default();

chai.use(chaiHttp);

describe('Protected routes (auth middleware)', () => {
  it(`should return 'No token provided.' 
on (POST /api/v1/recipes) when user doesn't provide a token`, (done) => {
      chai.request(app)
        .post('/api/v1/recipes')
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).deep.equal({
            success: false,
            message: 'No token provided.'
          });
          done();
        });
    });

  it(`should return 'No token provided.' on 
(POST /api/v1/users/recipes) if user doesn't provide a token`, (done) => {
      chai.request(app)
        .post('/api/v1/users/recipes')
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).deep.equal({
            success: false,
            message: 'No token provided.'
          });
          done();
        });
    });

  it(`should return 'No token provided.' on 
(POST /api/v1/recipes/1/upvotes) if user doesn't provide a token`, (done) => {
      chai.request(app)
        .post('/api/v1/recipes/1/upvotes')
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).deep.equal({
            success: false,
            message: 'No token provided.'
          });
          done();
        });
    });

  it(`should return 'No token provided.' on 
(POST /api/v1/recipes/1/downvotes) if user doesn't provide a token`, (done) => {
      chai.request(app)
        .post('/api/v1/recipes/1/downvotes')
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).deep.equal({
            success: false,
            message: 'No token provided.'
          });
          done();
        });
    });

  it(`should return 'No token provided.' on
(PUT /api/v1/recipes/1) if user doesn't provide a token`, (done) => {
      chai.request(app)
        .put('/api/v1/recipes/1')
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).deep.equal({
            success: false,
            message: 'No token provided.'
          });
          done();
        });
    });

  it(`should return 'No token provided.' on 
(DELETE /api/v1/recipes/1) if user doesn't provide a token`, (done) => {
      chai.request(app)
        .delete('/api/v1/recipes/1')
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).deep.equal({
            success: false,
            message: 'No token provided.'
          });
          done();
        });
    });

  it(`should return 'Failed to authenticate token' on 
(POST /api/v1/recipes) if user provides a invalid token`, (done) => {
      chai.request(app)
        .post('/api/v1/recipes')
        .send({
          token: 'ehghjjlLaRjjhllkjRystonE',
          name: 'Ewedu Soup'
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

  it(`should return 'Failed to authenticate token' on 
'(GET /api/v1/recipes/1/upvotes) if user provides a invalid token`, (done) => {
      chai.request(app)
        .get('/api/v1/recipes/1/upvotes')
        .send({
          token: 'ehghjjlLaRjjhllkjRystonE',
          name: 'Ewedu Soup'
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
});

describe('Password encryption (encryption middleware)', () => {
  const password = 'myPassWord';
  const hash = newEncrytion.generateHash(password);
  it('should return \'true\' for a password match', () => {
    expect(newEncrytion.verifyHash(password, hash)).to.equal(true);
  });

  it('should return \'false\' for a password mismatch', () => {
    expect(newEncrytion.verifyHash('myPassword', hash)).to.equal(false);
  });
});
