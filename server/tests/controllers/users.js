import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jsonwebtoken from 'jsonwebtoken';
import { User } from '../../models';

import app from './../../app';

import { validUser } from '../../seedData/testSeedData';

chai.use(chaiHttp);

let token, userId;

describe('User Controller', () => {
  before((done) => {
    User.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true
    });
    User.create(validUser)
      .then(() => {
        done();
      });
  });
  describe('/POST User Sign Up', () => {
    describe('Validation', () => {
      describe('Password validation', () => {
        it(`should return 'Password must be between 6 to 50 characters!'
  for invalid password entry`, (done) => {
            chai.request(app)
              .post('/api/v1/users/signup')
              .set('Accept', 'application/json')
              .send({
                name: 'Lawal Lanre',
                username: 'Larrystone',
                email: 'larrystone@gmai.com',
                password: 'Hack'
              })
              .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.body).deep.equal({
                  success: false,
                  message: [
                    '<br/>* Password must be between 6 to 50 characters!'
                  ]
                });
                done();
              });
          });
      });

      describe('Name validation', () => {
        it('should return \'* Name must be between 3 to 100 characters!\'',
          (done) => {
            chai.request(app)
              .post('/api/v1/users/signup')
              .set('Accept', 'application/json')
              .send({
                username: 'Minime',
                email: 'minim@gmail.com',
                password: 'Hacklord'
              })
              .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.body).deep.equal({
                  success: false,
                  message: ['* Name must be between 3 to 100 characters!']
                });
                done();
              });
          });
      });

      describe('Username validation', () => {
        it(`should return 'Username must be between 3 to 50 characters!'
  for null`, (done) => {
            chai.request(app)
              .post('/api/v1/users/signup')
              .set('Accept', 'application/json')
              .send({
                name: 'Henrtta Maxwl',
                email: 'rystone@gmail.com',
                password: 'Hacklord'
              })
              .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.body).deep.equal({
                  success: false,
                  message: [
                    '<br/>* Username must be between 3 to 50 characters!'
                  ]
                });
                done();
              });
          });
      });

      describe('Email validation', () => {
        it('should return \'Enter a valid email address\' for \'lasrr@ss\'',
          (done) => {
            chai.request(app)
              .post('/api/v1/users/signup')
              .set('Accept', 'application/json')
              .send({
                name: 'ritta Maxwell',
                email: 'lasrr@ss',
                username: 'Henry',
                password: 'Hacking'
              })
              .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.body).deep.equal({
                  success: false,
                  message: ['<br/>* Enter a valid email address']
                });
                done();
              });
          });
      });
    });

    it('should create new user and return token', (done) => {
      chai.request(app)
        .post('/api/v1/users/signup')
        .set('Accept', 'application/json')
        .send({
          name: 'Lawal Lanre',
          username: 'Larrystone',
          email: 'larrystone@gmai.com',
          password: 'Hacknets'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.all.deep.keys(
            'success', 'message', 'token');
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to
            .equal('New user created/token generated!');
          done();
        });
    });

    it('should return \'Username already taken\' for \'Larrystone\'',
      (done) => {
        chai.request(app)
          .post('/api/v1/users/signup')
          .set('Accept', 'application/json')
          .send({
            name: 'Gbenga Dunmoye',
            username: 'Larrystone',
            email: 'gbengene@yahoo.com',
            password: 'westsddae',
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(409);
            expect(res.body).deep.equal({
              success: false,
              message: 'Username already taken!'
            });
            done();
          });
      });

    it('should return \'Email already taken\' for \'larrystone@gmai.com\'',
      (done) => {
        chai.request(app)
          .post('/api/v1/users/signup')
          .set('Accept', 'application/json')
          .send({
            name: 'Gbenga Micheal',
            username: 'cyberstone',
            email: 'larrystone@gmai.com',
            password: 'westsddae',
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(409);
            expect(res.body).deep.equal({
              success: false,
              message: 'Email already taken!'
            });
            done();
          });
      });
  });

  describe('/POST User Sign In', () => {
    it('should sign in user (with username)', (done) => {
      chai.request(app)
        .post('/api/v1/users/signin')
        .set('Accept', 'application/json')
        .send({
          authName: 'LaRRystonE',
          password: 'Hacknets'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.message).to.equal(
            'User Signed In/token generated!');
          done();
        });
    });

    it(`should return 'Invalid Login Credentials!' 
for invalid entries`, (done) => {
        chai.request(app)
          .post('/api/v1/users/signin')
          .set('Accept', 'application/json')
          .send({
            authName: 'gbengene@ymail.com',
            password: 'westsddaes',
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(401);
            expect(res.body).deep.equal({
              success: false,
              message: 'Invalid Login Credentials!'
            });
            done();
          });
      });

    describe('Case insensitive authName', () => {
      it('should sign in \'LARRYSTONE@GMAI.COM\'', (done) => {
        chai.request(app)
          .post('/api/v1/users/signin')
          .set('Accept', 'application/json')
          .send({
            authName: 'larrystone@gmai.com'.toUpperCase(),
            password: 'Hacknets'
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.all.deep.keys(
              'success', 'message', 'token');
            done();
          });
      });

      it('should sign in \'larrySTONE\'', (done) => {
        chai.request(app)
          .post('/api/v1/users/signin')
          .set('Accept', 'application/json')
          .send({
            authName: 'larrySTONE',
            password: 'Hacknets'
          })
          .end((err, res) => {
            token = res.body.token;
            userId = jsonwebtoken.decode(token).id;
            expect(res.statusCode).to.equal(200);
            expect(res.body.success).to.equal(true);
            done();
          });
      });
    });
  });

  describe('/GET User profile', () => {
    it('should return a user', (done) => {
      chai.request(app)
        .get(`/api/v1/users/${userId}/profile`)
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.user).to.have.all.deep.keys(
            'userId', 'name',
            'imageUrl',
            'myFavs',
            'myRecipes',
            'myReviews',
            'username', 'email');
          expect(res.body.user.name).to.equal('Lawal Lanre');
          expect(res.body.user.username).to.equal('Larrystone');
          expect(res.body.user.email).to.equal('larrystone@gmai.com');
          done();
        });
    });
  });

  describe('/PUT Update user profile', () => {
    it('should update user details', (done) => {
      chai.request(app)
        .put('/api/v1/users/profile')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .send({
          name: 'lane stone',
          username: 'lanestoneq',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.user).to.have.all.deep.keys(
            'name',
            'username',
            'imageUrl',
            'token'
          );
          expect(res.body.user.name).to.equal('lane stone');
          expect(res.body.user.username).to.equal('lanestoneq');
          done();
        });
    });

    it('should return \'Username already taken\' for \'larrystone\'',
      (done) => {
        chai.request(app)
          .put('/api/v1/users/profile')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .send({
            name: 'lane stone',
            username: 'stonexy',
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(409);
            expect(res.body.success).to.equal(false);
            expect(res.body.message).to.equal('Username already taken');
            done();
          });
      });
  });

  describe('/PUT Change password', () => {
    it('should return \'Password must be at least 6 characters!\' for \'ab\'',
      (done) => {
        chai.request(app)
          .put('/api/v1/users/changePassword')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .send({
            oldPassword: 'westsddae',
            newPassword: 'ab',
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body.message)
              .to.equal('Password must be at least 6 characters!');
            done();
          });
      });

    it('should return \'Failed to authenticate token.\' for invalid token',
      (done) => {
        chai.request(app)
          .put('/api/v1/users/changePassword')
          .set('Accept', 'application/json')
          .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZ' +
          '6NDY4LCJlbWFpbCI6ImpvaG5kb2VAY29tcGFueS5jb20iLCJ1c2VybmFtZSI6Impv' +
          '5kb2UiLCJpYXQiOjE1MTA1OTI3Nzd9.Oa9wuSqolP2oM5-uKWN0ZukagWx2ZC1kN2' +
          'XGZoM-s')
          .send({
            oldPassword: 'westsddae',
            newPassword: 'ywhahdbidvsdv',
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(401);
            expect(res.body.message).to.equal('Failed to authenticate token.');
            done();
          });
      });

    it('should return \'Incorrect Password\'',
      (done) => {
        chai.request(app)
          .put('/api/v1/users/changePassword')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .send({
            oldPassword: 'westshguuvyli.v',
            newPassword: 'sdsdsdsdsds',
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(401);
            expect(res.body.message).to.equal('Incorrect Password');
            done();
          });
      });

    it('should return \'Password Changed Successfully\'',
      (done) => {
        chai.request(app)
          .put('/api/v1/users/changePassword')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .send({
            oldPassword: 'Hacknets',
            newPassword: 'sdsdsdagvdsds',
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body.message).to.equal('Password Changed Successfully');
            done();
          });
      });
  });
});
