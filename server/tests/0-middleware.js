import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import * as Encryption from './../../server/middleware/encryption';

import server from './../app';

const newEncrytion = new Encryption.default();

chai.use(chaiHttp);

describe('Protected routes (auth middleware)', () => {
  it('should return \'No token provided.\' (POST /api/v1/recipes)', (done) => {
    chai.request(server)
      .post('/api/v1/recipes')
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body).deep.equal({
          success: false,
          message: 'No token provided.' });
        done();
      });
  });

  it('should return \'No token provided.' +
  '\' (POST /api/v1/users/recipes)', (done) => {
    chai.request(server)
      .post('/api/v1/users/recipes')
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body).deep.equal({
          success: false,
          message: 'No token provided.' });
        done();
      });
  });

  it('should return \'No token provided.' +
  '\' (POST /api/v1/recipes/1/upvotes)', (done) => {
    chai.request(server)
      .post('/api/v1/recipes/1/upvotes')
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body).deep.equal({
          success: false,
          message: 'No token provided.' });
        done();
      });
  });

  it('should return \'No token provided.' +
  '\' (POST /api/v1/recipes/1/downvotes)', (done) => {
    chai.request(server)
      .post('/api/v1/recipes/1/downvotes')
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body).deep.equal({
          success: false,
          message: 'No token provided.' });
        done();
      });
  });

  it('should return \'No token provided.' +
  '\' (PUT /api/v1/recipes/1)', (done) => {
    chai.request(server)
      .put('/api/v1/recipes/1')
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body).deep.equal({
          success: false,
          message: 'No token provided.' });
        done();
      });
  });

  it('should return \'No token provided.' +
  '\' (DELETE /api/v1/recipes/1)', (done) => {
    chai.request(server)
      .delete('/api/v1/recipes/1')
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body).deep.equal({
          success: false,
          message: 'No token provided.' });
        done();
      });
  });

  it('should return \'Failed to authenticate token..\'' +
  '(POST /api/v1/recipes)', (done) => {
    chai.request(server)
      .post('/api/v1/recipes')
      .send({
        token: 'ehghjjlLaRjjhllkjRystonE',
        name: 'Ewedu Soup'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body).deep.equal({
          success: false,
          message: 'Failed to authenticate token.' });
        done();
      });
  });

  it('should return \'Failed to authenticate token..\'' +
  '(GET /api/v1/recipes/1/upvotes)', (done) => {
    chai.request(server)
      .get('/api/v1/recipes/1/upvotes')
      .send({
        token: 'ehghjjlLaRjjhllkjRystonE',
        name: 'Ewedu Soup'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body).deep.equal({
          success: false,
          message: 'Failed to authenticate token.' });
        done();
      });
  });
});

describe('Test encryption (encryption middleware)', () => {
  const password = 'myPassWord';
  const hash = newEncrytion.generateHash(password);
  it('should return \'true\' for match', () => {
    expect(newEncrytion.verifyHash(password, hash)).to.equal(true);
  });

  it('should return \'false\' for non-match', () => {
    expect(newEncrytion.verifyHash('myPassword', hash)).to.equal(false);
  });
});

