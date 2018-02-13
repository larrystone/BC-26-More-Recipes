import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import { Recipe } from '../../models';

import app from './../../app';

import { insertUserSeed, user1token } from '../../seedData/testSeedData';

chai.use(chaiHttp);

let token;
let recipeId;

describe('Recipe Controller', () => {
  before((done) => {
    Recipe.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
      .then(() => {
        insertUserSeed();
        token = user1token;
        done();
      });
  });

  describe('/GET all Recipes', () => {
    it(`should return \'Nothing found!\' when fetching all recipes 
but none found in the database`, (done) => {
        chai.request(app)
          .get('/api/v1/recipes')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end((err, res) => {
            expect(res.statusCode).to.equal(404);
            expect(res.body.success).to.equal(true);
            expect(res.body.message).to.equal('Nothing found!');
            done();
          });
      });

    it(`should return \'Nothing found!\' when fetching recipes by most upvotes
but none found in the database`, (done) => {
        chai.request(app)
          .get('/api/v1/recipes?sort=upvotes&order=descending ')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end((err, res) => {
            expect(res.statusCode).to.equal(404);
            expect(res.body.success).to.equal(true);
            expect(res.body.message).to.equal('Nothing found!');
            done();
          });
      });
  });

  describe('/POST Create Recipe', () => {
    it(`should return 'Recipe name must be between 3 to 100 characters!' 
for "Ew"`, (done) => {
        chai.request(app)
          .post('/api/v1/recipes')
          .set('Accept', 'application/json')
          .send({
            token,
            name: 'Ew',
            ingredients: 'Water;;Ewedu leaves;;Salt',
            procedure: 'Light stove and just start cooking'
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).deep.equal({
              success: false,
              message: ['* Recipe name must be between 3 to 100 characters!']
            });
            done();
          });
      });

    it(`should return 'Ingredients list must be between 10 to 2000 characters!'
for "water"`, (done) => {
        chai.request(app)
          .post('/api/v1/recipes')
          .set('Accept', 'application/json')
          .send({
            token,
            name: 'Ewedu Soup',
            ingredients: 'water',
            procedure: 'Light stove and just start cooking'
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).deep.equal({
              success: false,
              message: [
                '<br/>* Ingredients list must be between 10 to 2000 characters!'
              ]
            });
            done();
          });
      });

    it(`should return 'Procedures must be between 15 to 4000 characters!'
for "Light"`, (done) => {
        chai.request(app)
          .post('/api/v1/recipes')
          .set('Accept', 'application/json')
          .send({
            token,
            name: 'Ewedu Soup',
            ingredients: 'water;;salt;;maggi',
            procedure: 'Light'
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).deep.equal({
              success: false,
              message: [
                '<br/>* Procedures must be between 15 to 4000 characters!'
              ]
            });
            done();
          });
      });

    it('should create and return a recipe (Ewedu Soup)', (done) => {
      chai.request(app)
        .post('/api/v1/recipes')
        .set('Accept', 'application/json')
        .send({
          token,
          name: 'Ewedu Soup',
          ingredients: 'Water;;Ewedu leaves;;Salt',
          procedure: 'Light stove and just start cooking'
        })
        .end((err, res) => {
          recipeId = res.body.recipe.id;
          expect(res.statusCode).to.equal(201);
          expect(res.body.success).to.equal(true);
          expect(res.body.recipe.name).to.equal('Ewedu Soup');
          expect(res.body.recipe.description).to.equal('');
          expect(res.body.recipe.ingredients).to
            .equal('Water;;Ewedu leaves;;Salt');
          expect(res.body.recipe.procedure).to
            .equal('Light stove and just start cooking');
          done();
        });
    });
  });

  describe('/GET all Recipes by User', () => {
    it('should return an array of Recipes', (done) => {
      chai.request(app)
        .get('/api/v1/users/myRecipes')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.recipes.length).to.equal(1);
          done();
        });
    });
  });

  describe('/GET Search recipe by ingredient', () => {
    it('should return 3 recipes when search by \'water+rice\'', (done) => {
      chai.request(app)
        .get('/api/v1/recipes?ingredients=water+rice')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.recipes.length).to.equal(1);
          done();
        });
    });

    it('should return \'Nothing found!\' when search by \'garri\'', (done) => {
      chai.request(app)
        .get('/api/v1/recipes?ingredients=garri')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });


  describe('/GET Search recipe by valid anything (Generic search)', () => {
    it('should return 1 recipe when search by \'Ewedu+Soup\'', (done) => {
      chai.request(app)
        .get('/api/v1/recipes?search=Ewedu+Soup')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.recipes.length).to.equal(1);
          done();
        });
    });

    it('should return 1 recipe when search by \'water\'', (done) => {
      chai.request(app)
        .get('/api/v1/recipes?search=water')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.recipes.length).to.equal(1);
          done();
        });
    });

    it('should return \'Nothing found\' when' +
      ' search by \'createrecipetester@test.com\'', (done) => {
      chai.request(app)
        .get('/api/v1/recipes?search=createrecipetester@test.com')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.success).to.equal(true);
          expect(res.body.recipes.length).to.equal(0);
          done();
        });
    });

    it(
      'should return \'Nothing found\' when search by \'createREcipetester\'',
      (done) => {
        chai.request(app)
          .get('/api/v1/recipes?search=createREcipetester')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end((err, res) => {
            expect(res.statusCode).to.equal(404);
            expect(res.body.success).to.equal(true);
            expect(res.body.recipes.length).to.equal(0);
            done();
          });
      });

    it(
      'should return \'Nothing found\' when search by \'createreipetester\'',
      (done) => {
        chai.request(app)
          .get('/api/v1/recipes?search=createreipetester')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end((err, res) => {
            expect(res.statusCode).to.equal(404);
            expect(res.body.success).to.equal(true);
            expect(res.body.recipes.length).to.equal(0);
            done();
          });
      });
  });

  describe('/GET Search recipe by recipe name', () => {
    it('should return 1 recipe when search by \'ewedu+soup\'', (done) => {
      chai.request(app)
        .get('/api/v1/recipes?name=ewedu+soup')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.recipes.length).to.equal(1);
          done();
        });
    });

    it('should return \'Nothing found\' when search by \'garri\'', (done) => {
      chai.request(app)
        .get('/api/v1/recipes?name=garri')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });

  describe('/GET Recipe and log View count', () => {
    it('should return a recipe and set view count to 1', (done) => {
      chai.request(app)
        .get(`/api/v1/recipes/${recipeId}`)
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.recipe.viewCount).to.equal(1);
          done();
        });
    });

    it('should return a recipe and set view count to 2', (done) => {
      chai.request(app)
        .get(`/api/v1/recipes/${recipeId}`)
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.recipe.viewCount).to.equal(2);
          done();
        });
    });

    it('should return \'Recipe does not exist!\' for id: 100', (done) => {
      chai.request(app)
        .get('/api/v1/recipes/100')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).deep.equal({
            success: false,
            message: 'Recipe does not exist!'
          });
          done();
        });
    });

    it('should return \'Invalid recipe ID\' for id: \'abs\'', (done) => {
      chai.request(app)
        .get('/api/v1/recipes/abs')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).deep.equal({
            success: false,
            message: 'Invalid Recipe ID'
          });
          done();
        });
    });
  });

  describe('/PUT User Recipes', () => {
    it('should modify and return a recipe', (done) => {
      chai.request(app)
        .put(`/api/v1/recipes/${recipeId}`)
        .set('Accept', 'application/json')
        .send({
          token,
          name: 'Ewedu Soup',
          ingredients: 'Water;;Ewedu leaves;;Salt',
          procedure: 'Light stove and come back here to see this'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('should return \'You cannot modify a recipe not created by You!\'',
      (done) => {
        chai.request(app)
          .put(`/api/v1/recipes/${recipeId + 1}`)
          .set('Accept', 'application/json')
          .send({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEzLCJlbWF' +
              'pbCI6InNkc2RzbGFzc3NAZ21haWwuY29tIiwidXNlcm5hbWUiOiJsYXJyeXN0b2' +
              '5lMSIsImlhdCI6MTUxMTAzMTcwNn0.LW0tTpc8l8YPp03kDxuoRDW-kcDoFgGid' +
              'ApMoV5-3dg',
            name: 'Amala Soup',
            ingredients: 'Water;;Ewedu leaves;;Salt',
            procedure: 'I wil tel you later'
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(401);
            expect(res.body.success).to.equal(false);
            done();
          });
      });

    it(`should return 'Recipe does not exist!' for id: ${+recipeId * 4}`,
      (done) => {
        chai.request(app)
          .put(`/api/v1/recipes/${recipeId * 4}`)
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .send({
            token,
            name: 'Amala Soup',
            ingredients: 'Water;;Ewedu leaves;;Salt',
            procedure: 'I wil tel you later'
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(404);
            expect(res.body).deep.equal({
              success: false,
              message: 'Recipe does not exist!'
            });
            done();
          });
      });
  });

  describe('/GET all Recipes', () => {
    it('should return an array of Recipes', (done) => {
      chai.request(app)
        .get('/api/v1/recipes')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should return an array of Recipes sorted by most upvotes', (done) => {
      chai.request(app)
        .get('/api/v1/recipes?sort=upvotes&order=descending ')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('/DELETE User Recipes', () => {
    it(`should delete a recipe with id ${recipeId}`, (done) => {
      chai.request(app)
        .delete(`/api/v1/recipes/${recipeId}`)
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it(`should return 'Failed to authenticate token.' for invalid user token: 
${recipeId + 2}`,
    (done) => {
      chai.request(app)
        .delete(`/api/v1/recipes/${recipeId + 2}`)
        .set('Accept', 'application/json')
        .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI' +
          '6MzEzLCJlbWFpbCI6InNkc2RzbGFzc3NAZ21haWwuY29tIiwidXNlcm5hbWUiOiJs' +
          'eXN0b25lMSIsImlhdCI6MTUxMTAzMTcwNn0.LW0tTpc8l8YPp03kDxuoRDW-kcDoF' +
          'idApMoV5-3dg')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body).deep.equal({
            success: false,
            message: 'Failed to authenticate token.'
          });
          done();
        });
    });

    it('should return \'Recipe does not exist!\' for id: 900', (done) => {
      chai.request(app)
        .delete('/api/v1/recipes/100')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .send({
          token,
          name: 'Amala Soup',
          ingredients: 'Water;;Ewedu leaves;;Salt',
          procedure: 'I wil tel you later'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).deep.equal({
            success: false,
            message: 'Recipe does not exist!'
          });
          done();
        });
    });
  });

  describe('/GET all Recipes', () => {
    it('should return an an empty array of Recipes', (done) => {
      chai.request(app)
        .get('/api/v1/recipes')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.recipes.length).to.equal(0);
          done();
        });
    });
  });

  describe('/GET all Recipes by User', () => {
    it('should return an empty array of Recipes', (done) => {
      chai.request(app)
        .get('/api/v1/users/myRecipes')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.recipes.length).to.equal(0);
          done();
        });
    });
  });
});
