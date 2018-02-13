/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { User } from '../../models';
import * as seedData from '../../seedData/testSeedData';

let userId;
let userName;
let userEmail;
let name;

describe('USER MODEL', () => {
  before((done) => {
    User.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
      .then(() => {
        done();
      });
  });
  it('should create a new user', (done) => {
    User.create(seedData.validUser)
      .then((user) => {
        const { id, username, email } = user.dataValues;
        userId = id;
        userName = username;
        userEmail = email;
        name = user.dataValues.name;
        expect(user.dataValues).to.have.property('id');
        expect(user.dataValues).to.have.property('email');
        expect(user.dataValues).to.have.property('username');
        expect(user.dataValues).to.have.property('createdAt');
        expect(user.dataValues).to.have.property('updatedAt');
        expect(user.dataValues.email).to.equal(seedData.validUser.email);
        expect(user.dataValues.username).to.equal(seedData.validUser.username);
        expect(user.dataValues.createdAt).to.exist;
        expect(user.dataValues.updatedAt).to.exist;
        done();
      });
  });
  it(
    'should throw a validation error for an empty or incorrect email ',
    (done) => {
      User.create(seedData.userWithNoEmail)
        .catch((error) => {
          expect(error.errors[0].message).to.equal('Invalid email address');
          expect(error.errors[0].type).to.equal('Validation error');
          done();
        });
    }
  );
  it('should throw a validation error for an empty name ', (done) => {
    User.create(seedData.userWithNoName)
      .catch((error) => {
        expect(error.errors).to.be.an('array');
        expect(error.errors[0].message).to.equal('name cannot be empty');
        expect(error.errors[0].type).to.equal('Validation error');
        done();
      });
  });
  it('should throw a validation error for a null username ', (done) => {
    User.create(seedData.userWithNoUsername)
      .catch((error) => {
        expect(error.errors).to.be.an('array');
        expect(error.errors[0].message).to.equal('username cannot be empty');
        expect(error.errors[0].type).to.equal('Validation error');
        done();
      });
  });
  it('should throw a validation error for an empty password ', (done) => {
    User.create(seedData.userWithNoPassword)
      .catch((error) => {
        expect(error.errors).to.be.an('array');
        expect(error.errors[0].message).to.equal('Password cannot be empty');
        expect(error.errors[0].type).to.equal('Validation error');
        done();
      });
  });
  it('should raise a validation error for duplicated email', (done) => {
    User.create(seedData.duplicateEmail)
      .catch((error) => {
        expect(error.errors).to.be.an('array');
        expect(error.errors[0].message)
          .to.equal('email must be unique');
        expect(error.errors[0].type).to.equal('unique violation');
        expect(error.errors[0].path).to.equal('email');
        expect(error.errors[0].value).to.equal('stonelarry@yahoo.com');
        done();
      });
  });
  it('should raise a validation error for duplicated username', (done) => {
    User.create(seedData.duplicateUsername)
      .catch((error) => {
        expect(error.errors).to.be.an('array');
        expect(error.errors[0].message)
          .to.equal('username must be unique');
        expect(error.errors[0].type).to.equal('unique violation');
        expect(error.errors[0].path).to.equal('username');
        expect(error.errors[0].value).to.equal('stonexy');
        done();
      });
  });
  it('should be able to find user by Id', (done) => {
    User.findById(userId)
      .then((user) => {
        expect(user.dataValues).to.have.property('id');
        expect(user.dataValues).to.have.property('email');
        expect(user.dataValues).to.have.property('username');
        expect(user.dataValues).to.have.property('createdAt');
        expect(user.dataValues).to.have.property('updatedAt');
        expect(user.dataValues).to.have.property('password');
        expect(user.dataValues.id).to.equal(userId);
        expect(user.dataValues.email).to.equal(seedData.validUser.email);
        expect(user.dataValues.username).to.equal(seedData.validUser.username);
        expect(user.dataValues.createdAt).to.exist;
        expect(user.dataValues.updatedAt).to.exist;
        done();
      });
  });
  it('should be able to find user by username', (done) => {
    User.findOne({
      where: {
        username: userName
      }
    })
      .then((user) => {
        expect(user.dataValues).to.have.property('id');
        expect(user.dataValues).to.have.property('email');
        expect(user.dataValues).to.have.property('username');
        expect(user.dataValues).to.have.property('createdAt');
        expect(user.dataValues).to.have.property('updatedAt');
        expect(user.dataValues).to.have.property('password');
        expect(user.dataValues.id).to.equal(userId);
        expect(user.dataValues.email).to.equal(seedData.validUser.email);
        expect(user.dataValues.username).to.equal(userName);
        expect(user.dataValues.createdAt).to.exist;
        expect(user.dataValues.updatedAt).to.exist;
        done();
      });
  });
  it('should be able to find user by email', (done) => {
    User.findOne({
      where: {
        email: userEmail
      }
    })
      .then((user) => {
        expect(user.dataValues).to.have.property('id');
        expect(user.dataValues).to.have.property('email');
        expect(user.dataValues).to.have.property('username');
        expect(user.dataValues).to.have.property('createdAt');
        expect(user.dataValues).to.have.property('updatedAt');
        expect(user.dataValues).to.have.property('password');
        expect(user.dataValues.id).to.equal(userId);
        expect(user.dataValues.email).to.equal(userEmail);
        expect(user.dataValues.username).to.equal(seedData.validUser.username);
        expect(user.dataValues.createdAt).to.exist;
        expect(user.dataValues.updatedAt).to.exist;
        done();
      });
  });
  it('should be able to find user by name', (done) => {
    User.findOne({
      where: {
        name
      }
    })
      .then((user) => {
        expect(user.dataValues).to.have.property('id');
        expect(user.dataValues).to.have.property('email');
        expect(user.dataValues).to.have.property('username');
        expect(user.dataValues).to.have.property('createdAt');
        expect(user.dataValues).to.have.property('updatedAt');
        expect(user.dataValues).to.have.property('password');
        expect(user.dataValues.email).to.equal(seedData.validUser.email);
        expect(user.dataValues.username).to.equal(seedData.validUser.username);
        expect(user.dataValues.createdAt).to.exist;
        expect(user.dataValues.updatedAt).to.exist;
        done();
      });
  });
});
