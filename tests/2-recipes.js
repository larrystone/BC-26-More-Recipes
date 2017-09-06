import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from './../server/app';

chai.use(chaiHttp);

let token;
let recipeId;

describe('/POST Create User', () => {
  it('should save token', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .set('Accept', 'application/json')
      .send({
        name: 'Create Recipe Tester',
        username: 'CreateRecipeTester',
        email: 'createrecipetester@test.com',
        password: 'testing'
      })
      .end((err, res) => {
        token = res.body.data.token;
        expect(res.statusCode).to.equal(201);
        done();
      });
  });
});


describe('/POST Recipe Test', () => {
  it('should create and return a recipe', (done) => {
    chai.request(server)
      .post('/api/v1/recipes')
      .set('Accept', 'application/json')
      .send({
        token,
        name: 'Ewedu Soup',
        ingredients: 'Water;;Ewedu leaves;;Salt',
        direction: 'Light stove and just start cooking'
      })
      .end((err, res) => {
        recipeId = res.body.data.id;
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        done();
      });
  });

  it('should create and return a recipe', (done) => {
    chai.request(server)
      .post('/api/v1/recipes')
      .set('Accept', 'application/json')
      .send({
        token,
        name: 'Fried Rice',
        ingredients: 'Water;;Rice;;Salt',
        direction: 'Light stove and put rice'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        done();
      });
  });

  it('should create and return a recipe', (done) => {
    chai.request(server)
      .post('/api/v1/recipes')
      .set('Accept', 'application/json')
      .send({
        token,
        name: 'Jollof Rice',
        ingredients: 'Water;;Rice;;Salt;;maggi',
        direction: 'Light stove, put rice and sleep'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        done();
      });
  });
});

describe('/PUT User Recipes Test', () => {
  it('should modify and return a recipe', (done) => {
    chai.request(server)
      .put(`/api/v1/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .send({
        token,
        name: 'Ewedu Soup',
        ingredients: 'Water;;Ewedu leaves;;Salt',
        direction: 'Light stove and come back here to see this'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        done();
      });
  });

  it('should modify and return a recipe', (done) => {
    chai.request(server)
      .put(`/api/v1/recipes/${recipeId + 1}`)
      .set('Accept', 'application/json')
      .send({
        token,
        name: 'Amala Soup',
        ingredients: 'Water;;Ewedu leaves;;Salt',
        direction: 'I wil tel you later'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        done();
      });
  });

  it('should return \'No matching recipe with id: 100\'', (done) => {
    chai.request(server)
      .put('/api/v1/recipes/100')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({
        token,
        name: 'Amala Soup',
        ingredients: 'Water;;Ewedu leaves;;Salt',
        direction: 'I wil tel you later'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).deep.equal({
          success: false,
          message: 'No matching recipe with id: 100'
        });
        done();
      });
  });
});

describe('/DELETE User Recipes Test', () => {
  it('should delete a recipe', (done) => {
    chai.request(server)
      .delete(`/api/v1/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(204);
        done();
      });
  });

  it('should delete a recipe', (done) => {
    chai.request(server)
      .delete(`/api/v1/recipes/${recipeId + 1}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(204);
        done();
      });
  });

  it('should delete a recipe', (done) => {
    chai.request(server)
      .delete(`/api/v1/recipes/${recipeId + 2}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(204);
        done();
      });
  });

  it('should return \'No matching recipe with id: 100\'', (done) => {
    chai.request(server)
      .delete('/api/v1/recipes/100')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({
        token,
        name: 'Amala Soup',
        ingredients: 'Water;;Ewedu leaves;;Salt',
        direction: 'I wil tel you later'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).deep.equal({
          success: false,
          message: 'No matching recipe with id: 100'
        });
        done();
      });
  });
});

describe('/GET all Recipes Test', () => {
  it('should return an array of Recipes', (done) => {
    chai.request(server)
      .get('/api/v1/recipes')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });
});

describe('/GET all Recipes by User Test', () => {
  it('should return an array of Recipes', (done) => {
    chai.request(server)
      .get('/api/v1/users/myRecipes')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });
});
