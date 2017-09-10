import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import * as Encryption from './../server/middleware/encryption';

import server from './../server/app';

const newEncrytion = new Encryption.default();

chai.use(chaiHttp);

describe('Home page link', () => {
  it('should return \'Please navigate ' +
  'this API via \'/api/v1/\' url prefix\'', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).deep.equal({
          title: 'More-Recipes',
          message: 'Please navigate this API via \'/api/v1/\' url prefix'
        });
        done();
      });
  });
});

describe('Invalid links', () => {
  it('should return \'invalid link\' (GET /api)', (done) => {
    chai.request(server)
      .get('/api')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).deep.equal({
          success: false,
          message: 'invalid link' });
        done();
      });
  });

  it('should return \'invalid link\' (GET /api/v)', (done) => {
    chai.request(server)
      .get('/api/v')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).deep.equal({
          success: false,
          message: 'invalid link' });
        done();
      });
  });

  it('should return \'invalid link\' (GET /users)', (done) => {
    chai.request(server)
      .get('/users')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).deep.equal({
          success: false,
          message: 'invalid link' });
        done();
      });
  });

  it('should return \'invalid link\' (POST /api/recipes)', (done) => {
    chai.request(server)
      .post('/api/recipes')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).deep.equal({
          success: false,
          message: 'invalid link' });
        done();
      });
  });

  it('should return \'invalid link\' (POST /recipes/1/upvotes)', (done) => {
    chai.request(server)
      .post('/recipes/1/upvotes')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).deep.equal({
          success: false,
          message: 'invalid link' });
        done();
      });
  });

  it('should return \'invalid link\' (POST /recipe/1/favorites)', (done) => {
    chai.request(server)
      .post('/recipe/1/favorites')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).deep.equal({
          success: false,
          message: 'invalid link' });
        done();
      });
  });
});

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
        expect(res.statusCode).to.equal(200);
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
        expect(res.statusCode).to.equal(200);
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

