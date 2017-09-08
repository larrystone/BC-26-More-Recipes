import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from './../server/app';

chai.use(chaiHttp);

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
        expect(res.statusCode).to.equal(403);
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
        expect(res.statusCode).to.equal(403);
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
        expect(res.statusCode).to.equal(403);
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
        expect(res.statusCode).to.equal(403);
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
        expect(res.statusCode).to.equal(403);
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
        expect(res.statusCode).to.equal(403);
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
        expect(res.statusCode).to.equal(403);
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
        expect(res.statusCode).to.equal(403);
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
        expect(res.body.data).to.have.all.deep.keys(
          'userId', 'username', 'email', 'token');
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
        expect(res.body.data).to.have.all.deep.keys(
          'userId', 'username', 'email', 'token');
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
        expect(res.body.data).to.have.all.deep.keys(
          'userId', 'username', 'email', 'token');
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
        expect(res.statusCode).to.equal(403);
        expect(res.body).deep.equal({
          success: false,
          message: 'Username already taken!'
        });
        done();
      });
  });

  it('should return \'Username already taken\' error', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .set('Accept', 'application/json')
      .send({
        name: 'Gbenga Micheal',
        username: 'gbenges',
        email: 'gbengene@yahoo.com',
        password: 'westsddae',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body).deep.equal({
          success: false,
          message: 'Username already taken!'
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
        username: 'LaRRystonE',
        password: 'Hacknets'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.data).to.have.all.deep.keys(
          'id', 'name',
          'username', 'email', 'token');
        done();
      });
  });

  describe('/POST User Sign In Test', () => {
    it('should sign in and return the user with email', (done) => {
      chai.request(server)
        .post('/api/v1/users/signin')
        .set('Accept', 'application/json')
        .send({
          email: 'temitope@yahoo.com',
          password: 'westerdae',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.data).to.have.all.deep.keys(
            'id', 'name',
            'username', 'email', 'token');
          done();
        });
    });

    it(`should sign in user- ${'gbengene@yahoo.com'.toUpperCase()}`, (done) => {
      chai.request(server)
        .post('/api/v1/users/signin')
        .set('Accept', 'application/json')
        .send({
          email: 'gbengene@yahoo.com'.toUpperCase(),
          password: 'westsddae',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.data).to.have.all.deep.keys(
            'id', 'name',
            'username', 'email', 'token');
          done();
        });
    });

    it('should sign in and return the user', (done) => {
      chai.request(server)
        .post('/api/v1/users/signin')
        .set('Accept', 'application/json')
        .send({
          username: 'gbengE',
          password: 'westsddae',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.data).to.have.all.deep.keys(
            'id', 'name',
            'username', 'email', 'token');
          done();
        });
    });

    it('should return \'Username or email does not exist!\' error', (done) => {
      chai.request(server)
        .post('/api/v1/users/signin')
        .set('Accept', 'application/json')
        .send({
          email: 'gbengene@ymail.com',
          password: 'westsddaes',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).deep.equal({
            success: false,
            message: 'Username or email does not exist!'
          });
          done();
        });
    });

    it('should return \'Incorrect Password!\' error', (done) => {
      chai.request(server)
        .post('/api/v1/users/signin')
        .set('Accept', 'application/json')
        .send({
          email: 'gbengene@yahoo.com',
          password: 'westsddaes',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body).deep.equal({
            success: false,
            message: 'Incorrect Password!'
          });
          done();
        });
    });
  });
});
