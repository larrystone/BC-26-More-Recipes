import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from './../server/app';
import models from './../server/models';

process.env.NODE_ENV = 'development';

const user = models.User;

chai.use(chaiHttp);

describe('User', () => {
  beforeEach((done) => {
    user.destroy({
      where: { },
      truncate: true,
      cascade: true
    }).then(() => {
      done();
    });
  });

  describe('/POST User Sign Up Test', () => {
    it('should create a new user and return the user', (done) => {
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
          expect(res.body).to.have.all.deep.keys('userId', 'username', 'email');
          done();
        });
    });

    it('should create a new user and return the user', (done) => {
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
          expect(res.body).to.have.all.deep.keys('userId', 'username', 'email');
          done();
        });
    });
  });
});

