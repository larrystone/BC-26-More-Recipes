import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';

import server from './../app';

chai.use(chaiHttp);

let token, userId;

describe('/POST User Sign Up validation Test', () => {
  it('should return \'Password must be at least 6 characters!\'', (done) => {
    chai.request(server)
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
          message: 'Password must be at least 6 characters!'
        });
        done();
      });
  });

  it('should return \'Error Creating user\' for null name', (done) => {
    chai.request(server)
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
          message: 'Enter a valid full name!'
        });
        done();
      });
  });

  it('should return \'Error Creating user\' for single name', (done) => {
    chai.request(server)
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
          message: 'Enter a valid full name!'
        });
        done();
      });
  });

  it('should return \'Error Creating user\' for null Username', (done) => {
    chai.request(server)
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
          message: 'Username must contain at least 3 alphabets!'
        });
        done();
      });
  });

  it('should return \'Error Creating user\' for null email', (done) => {
    chai.request(server)
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
          message: 'Enter a valid email address'
        });
        done();
      });
  });

  it('should return \'Error Creating user\' for invalid email', (done) => {
    chai.request(server)
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
          message: 'Enter a valid email address'
        });
        done();
      });
  });

  it('should return \'Error Creating user\' for invalid email', (done) => {
    chai.request(server)
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
          message: 'Enter a valid email address'
        });
        done();
      });
  });

  it('should return \'Error Creating user\' for invalid password', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .set('Accept', 'application/json')
      .send({
        name: 'ritta Maxwell',
        email: 'larrystone@ssa.com',
        username: 'Henry',
        password: ''
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).deep.equal({
          success: false,
          message: 'Password must be at least 6 characters!'
        });
        done();
      });
  });
});


describe('/POST User Sign Up Test', () => {
  it('should create and return new user', (done) => {
    chai.request(server)
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
        done();
      });
  });

  it('should create and return new user', (done) => {
    chai.request(server)
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

  it('should create and return new user', (done) => {
    chai.request(server)
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

  it('should return \'Username already taken\' error', (done) => {
    chai.request(server)
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

  it('should return \'Email already taken\' error', (done) => {
    chai.request(server)
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
  it('should sign in and return the username', (done) => {
    chai.request(server)
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
    it('should sign in and return the user with email', (done) => {
      chai.request(server)
        .post('/api/v1/users/signin')
        .set('Accept', 'application/json')
        .send({
          authName: 'temitope@yahoo.com',
          password: 'westerdae',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.all.deep.keys(
            'success', 'message', 'token');
          done();
        });
    });

    it(`should sign in user ${'gbengene@yahoo.com'.toUpperCase()}`, (done) => {
      chai.request(server)
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

    it('should sign in and return the user', (done) => {
      chai.request(server)
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

    it('should return \'Invalid Login Credentials!\' error', (done) => {
      chai.request(server)
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

    it('should return \'Invalid Login Credentials!\' error', (done) => {
      chai.request(server)
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
  it('should return a user if any', (done) => {
    chai.request(server)
      .get(`/api/v1/users/${userId}/profile`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.user).to.have.all.deep.keys(
          'userId', 'name',
          'username', 'email');
        done();
      });
  });
});

describe('/PUT Change password test', () => {
  it('should return \'Password must be at least 6 characters!\' for \'ab\'',
    (done) => {
      chai.request(server)
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

  it('should return \'User does not exit\' for \'ab\'',
    (done) => {
      chai.request(server)
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
          expect(res.statusCode).to.equal(404);
          expect(res.body.message).to.equal('User does not exist!');
          done();
        });
    });

  it('should return \'Incorrect Password\' for \'westshguuvyli.v\'', (done) => {
    chai.request(server)
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

  it('should return \'Password Changed Successfully\' for \'westsddae\'',
    (done) => {
      chai.request(server)
        .put('/api/v1/users/changePassword')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .send({
          oldPassword: 'westsddae',
          newPassword: 'sdsdsdsdsds',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.message).to.equal('Password Changed Successfully');
          done();
        });
    });
});
