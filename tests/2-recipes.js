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


describe('/POST Create Recipe Test', () => {
  it('should return \'Enter a valid recipe name!\'', (done) => {
    chai.request(server)
      .post('/api/v1/recipes')
      .set('Accept', 'application/json')
      .send({
        token,
        name: 'Ew',
        ingredients: 'Water;;Ewedu leaves;;Salt',
        direction: 'Light stove and just start cooking'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body).deep.equal({
          success: false,
          message: 'Enter a valid recipe name!'
        });
        done();
      });
  });

  it('should return \'Enter a valid list of ingredients!\'', (done) => {
    chai.request(server)
      .post('/api/v1/recipes')
      .set('Accept', 'application/json')
      .send({
        token,
        name: 'Ewedu Soup',
        ingredients: 'water',
        direction: 'Light stove and just start cooking'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body).deep.equal({
          success: false,
          message: 'Enter a valid list of ingredients!'
        });
        done();
      });
  });

  it('should return \'Explain the directions clearly please!\'', (done) => {
    chai.request(server)
      .post('/api/v1/recipes')
      .set('Accept', 'application/json')
      .send({
        token,
        name: 'Ewedu Soup',
        ingredients: 'water;;salt;;maggi',
        direction: 'Light'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body).deep.equal({
          success: false,
          message: 'Explain the directions clearly please!'
        });
        done();
      });
  });

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


describe('/GET Search recipe by ingredient', () => {
  it('should return 3 recipes when search by \'water+salt\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?ingredients=water+salt')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.length).to.equal(3);
        done();
      });
  });

  it('should return 3 recipes when search by \'water+rice\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?ingredients=water+rice')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.length).to.equal(3);
        done();
      });
  });

  it('should return 1 recipe when search by \'maggi\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?ingredients=maggi')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.length).to.equal(1);
        done();
      });
  });

  it('should return 0 recipe when search by \'garri\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?ingredients=garri')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.length).to.equal(0);
        done();
      });
  });

  it('should return 1 recipe when search by \'leaves\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?ingredients=leaves')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.length).to.equal(1);
        done();
      });
  });

  it('should return 1 recipe when search by \'soup\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?ingredients=maggi')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.length).to.equal(1);
        done();
      });
  });
});


describe('/GET Search recipe by valid anything (Generic search)', () => {
  it('should return 1 recipe when search by \'Ewedu+Soup\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?search=Ewedu+Soup')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.length).to.equal(1);
        done();
      });
  });

  it('should return 3 recipes when search by \'water\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?search=water')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.length).to.equal(3);
        done();
      });
  });

  it('should return 2 recipes when search by \'rice\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?search=rice')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.length).to.equal(2);
        done();
      });
  });

  it('should return 1 recipes when search by ' +
  '\'createrecipetester@test.com\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?search=createrecipetester@test.com')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.length).to.equal(1);
        done();
      });
  });

  it('should return 1 recipes when search by ' +
  '\'createREcipetester\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?search=createREcipetester')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.length).to.equal(1);
        done();
      });
  });

  it('should return 0 recipes when search by ' +
  '\'createreipetester\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?search=createreipetester')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.length).to.equal(0);
        done();
      });
  });
});


describe('/GET Recipe and log View count', () => {
  it('should return a recipe and set view count to 1', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.viewCount).to.equal(1);
        done();
      });
  });

  it('should return a recipe and set view count to 2', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.viewCount).to.equal(2);
        done();
      });
  });

  it('should return a recipe and set view count to 3', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.viewCount).to.equal(3);
        done();
      });
  });

  it('should return a recipe and set view count to 1', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId + 1}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.viewCount).to.equal(1);
        done();
      });
  });

  it('should return a recipe and set view count to 2', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId + 1}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.viewCount).to.equal(2);
        done();
      });
  });

  it('should return a recipe and set view count to 3', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId + 1}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body.data.viewCount).to.equal(3);
        done();
      });
  });

  it('should return \'No matching recipe with id: 100\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes/100')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
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

  it(`should return 'No matching recipe with id: ${+recipeId * 4}'`, (done) => {
    chai.request(server)
      .put(`/api/v1/recipes/${recipeId * 4}`)
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
          message: `No matching recipe with id: ${recipeId * 4}`
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

  it('should return \'No matching recipe with id: -1\'', (done) => {
    chai.request(server)
      .delete('/api/v1/recipes/-1')
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
          message: 'No matching recipe with id: -1'
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
