import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';

import app from './../app';

chai.use(chaiHttp);

let token, userId;

describe('/POST User Sign Up validation Test', () => {
  describe('Password validation test', () => {
    it(`should return 'Password must be at least 6 characters!'
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
              message: ['<br/>* Password must be at least 6 characters!']
            });
            done();
          });
      });
  });

  describe('Name validation test', () => {
    it('should return \'Enter a valid full name!\' for a null name', (done) => {
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
            message: ['* Enter a valid full name!']
          });
          done();
        });
    });

    it('should return \'Error Creating user\' for a single name', (done) => {
      chai.request(app)
        .post('/api/v1/users/signup')
        .set('Accept', 'application/json')
        .send({
          name: 'Lovelyn',
          username: 'Minime',
          email: 'minim@gmail.com',
          password: 'Hacklord'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).deep.equal({
            success: false,
            message: ['* Enter a valid full name!']
          });
          done();
        });
    });
  });

  describe('Username validation test', () => {
    it(`should return 'Username must contain at least 3 alphabets!' 
for null Username`, (done) => {
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
              message: ['<br/>* Username must contain at least 3 alphabets!']
            });
            done();
          });
      });
  });


  describe(`Email validation test should return 
'Enter a valid email address'`, () => {
      it('for null email entry', (done) => {
        chai.request(app)
          .post('/api/v1/users/signup')
          .set('Accept', 'application/json')
          .send({
            name: 'ritta Maxwell',
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

      it('for invalid email entry (lasrr@ss)', (done) => {
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

      it('for invalid email entry (lr@ss.com)', (done) => {
        chai.request(app)
          .post('/api/v1/users/signup')
          .set('Accept', 'application/json')
          .send({
            name: 'ritta Maxwell',
            email: 'lr@ss.com',
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


describe('/POST User Sign Up Test', () => {
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
        expect(res.body.message).to.equal('New user created/token generated!');
        done();
      });
  });

  it('should create new user and return token', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .set('Accept', 'application/json')
      .send({
        name: 'Temitope Adeoye',
        username: 'temitope',
        email: 'temitope@yahoo.com',
        password: 'westerdae',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.message).to.equal(
          'New user created/token generated!');
        done();
      });
  });

  it('should create new user and return token', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .set('Accept', 'application/json')
      .send({
        name: 'Gbenga Dunmoye',
        username: 'gbenge',
        email: 'gbengene@ yahoo.com',
        password: 'westsddae',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        done();
      });
  });

  it(`should return 'Username already taken' if 
user enters a username already used`, (done) => {
      chai.request(app)
        .post('/api/v1/users/signup')
        .set('Accept', 'application/json')
        .send({
          name: 'Gbenga Dunmoye',
          username: 'gbenge',
          email: 'gbengene@yahoo.comd',
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

  it(`should return 'Email already taken' if 
user enters an email address already used`, (done) => {
      chai.request(app)
        .post('/api/v1/users/signup')
        .set('Accept', 'application/json')
        .send({
          name: 'Gbenga Micheal',
          username: 'cyberstone',
          email: 'gbengene@yahoo.com',
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

describe('/POST User Sign In Test', () => {
  it('should sign in user (with username) and return token', (done) => {
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

  describe('/POST User Sign In Test', () => {
    it('should sign in user (with email) and return token', (done) => {
      chai.request(app)
        .post('/api/v1/users/signin')
        .set('Accept', 'application/json')
        .send({
          authName: 'temitope@yahoo.com',
          password: 'westerdae',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.all.deep
            .keys('success', 'message', 'token');
          expect(res.body.message).to
            .equal('User Signed In/token generated!');
          expect(res.body.success).to.equal(true);
          done();
        });
    });


    describe('Case insensitive test for email/username', () => {
      it(`should sign in user with email - 
'${'gbengene@yahoo.com'.toUpperCase()}'`, (done) => {
        chai.request(app)
          .post('/api/v1/users/signin')
          .set('Accept', 'application/json')
          .send({
            authName: 'gbengene@yahoo.com'.toUpperCase(),
            password: 'westsddae',
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.all.deep.keys(
              'success', 'message', 'token');
            done();
          });
      });

      it('should sign in user with username - \'gbengE\'', (done) => {
        chai.request(app)
          .post('/api/v1/users/signin')
          .set('Accept', 'application/json')
          .send({
            authName: 'gbengE',
            password: 'westsddae',
          })
          .end((err, res) => {
            token = res.body.token;
            userId = jwt.decode(token).id;
            expect(res.statusCode).to.equal(200);
            expect(res.body.success).to.equal(true);
            done();
          });
      });
    });

    it(`should return 'Invalid Login Credentials!' 
for invalid emtries`, (done) => {
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

    it(`should return 'Invalid Login Credentials!' 
for invalid emtries`, (done) => {
        chai.request(app)
          .post('/api/v1/users/signin')
          .set('Accept', 'application/json')
          .send({
            authName: 'gbengene@yahoo.com',
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
  });
});

describe('/GET User profile Test', () => {
  it('should return a user with a valid token', (done) => {
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
        expect(res.body.user.name).to.equal('Gbenga Dunmoye');
        expect(res.body.user.username).to.equal('gbenge');
        expect(res.body.user.email).to.equal('gbengene@yahoo.com');
        done();
      });
  });
});

describe('/PUT Update user profile Test', () => {
  it('should update user details successfully', (done) => {
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

  it(`should return 'Username already taken' 
when user picks an already taken username (larrystone)`, (done) => {
      chai.request(app)
        .put('/api/v1/users/profile')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .send({
          name: 'lane stone',
          username: 'Larrystone',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(409);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('Username already taken');
          done();
        });
    });
});

describe('/PUT Change password test', () => {
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

  it('should return \'Failed to authenticate token.\' '
    + 'for invalid token', (done) => {
    chai.request(app)
      .put('/api/v1/users/changePassword')
      .set('Accept', 'application/json')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI' +
        '6NDY4LCJlbWFpbCI6ImpvaG5kb2VAY29tcGFueS5jb20iLCJ1c2VybmFtZSI6ImpvaG' +
        '5kb2UiLCJpYXQiOjE1MTA1OTI3Nzd9.Oa9wuSqolP2oM5-uKWN0ZukagWx2ZC1kN2tP' +
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

  it('should return \'Incorrect Password\' for incorrect password', (done) => {
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

  it('should return \'Password Changed Successfully\' for valid password',
    (done) => {
      chai.request(app)
        .put('/api/v1/users/changePassword')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .send({
          oldPassword: 'westsddae',
          newPassword: 'sdsdsdagvdsds',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.message).to.equal('Password Changed Successfully');
          done();
        });
    });
});
