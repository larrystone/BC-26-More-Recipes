import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from './../app';

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
        token = res.body.token;
        expect(res.statusCode).to.equal(201);
        done();
      });
  });
});

describe('/GET all Recipes Test', () => {
  it('should return a \'not found\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
  });

  it('should return an empty array (sort by most upvotes)', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?sort=upvotes&order=descending ')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
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
        procedure: 'Light stove and just start cooking'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
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
        procedure: 'Light stove and just start cooking'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).deep.equal({
          success: false,
          message: 'Enter a valid list of ingredients!'
        });
        done();
      });
  });

  it('should return \'Explain the procedures clearly please!\'', (done) => {
    chai.request(server)
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
          message: 'Explain the procedures clearly please!'
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
        procedure: 'Light stove and just start cooking'
      })
      .end((err, res) => {
        recipeId = res.body.recipe.id;
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
        procedure: 'Light stove and put rice'
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
        procedure: 'Light stove, put rice and sleep'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.success).to.equal(true);
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
        expect(res.statusCode).to.equal(200);
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
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.recipes.length).to.equal(3);
        done();
      });
  });

  it('should return 3 recipes when search by \'water+rice\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?ingredients=water+rice')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.recipes.length).to.equal(3);
        done();
      });
  });

  it('should return 1 recipe when search by \'maggi\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?ingredients=maggi')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.recipes.length).to.equal(1);
        done();
      });
  });

  it('should return \'Not Found\' when search by \'garri\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?ingredients=garri')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.success).to.equal(true);
        done();
      });
  });

  it('should return 1 recipe when search by \'leaves\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?ingredients=leaves')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.recipes.length).to.equal(1);
        done();
      });
  });

  it('should return 1 recipe when search by \'soup\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?ingredients=maggi')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.recipes.length).to.equal(1);
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
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.recipes.length).to.equal(1);
        done();
      });
  });

  it('should return 3 recipes when search by \'water\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?search=water')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.recipes.length).to.equal(3);
        done();
      });
  });

  it('should return 2 recipes when search by \'rice\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?search=rice')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.recipes.length).to.equal(2);
        done();
      });
  });

  it('should return \'Nothing found\' when' +
    ' search by \'createrecipetester@test.com\'', (done) => {
    chai.request(server)
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
      chai.request(server)
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
      chai.request(server)
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
    chai.request(server)
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

  it('should return 2 recipes when search by \'rice\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?name=rice')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.recipes.length).to.equal(2);
        done();
      });
  });

  it('should return 1 recipes when search by \'Fried+rice\'', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?name=fried+rice')
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
    chai.request(server)
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
    chai.request(server)
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
    chai.request(server)
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

  it('should return a recipe and set view count to 3', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.recipe.viewCount).to.equal(3);
        done();
      });
  });

  it('should return a recipe and set view count to 1', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId + 1}`)
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
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId + 1}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.recipe.viewCount).to.equal(2);
        done();
      });
  });

  it('should return a recipe and set view count to 3', (done) => {
    chai.request(server)
      .get(`/api/v1/recipes/${recipeId + 1}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.recipe.viewCount).to.equal(3);
        done();
      });
  });

  it('should return \'Recipe does not exist!\' for id: 100', (done) => {
    chai.request(server)
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
    chai.request(server)
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

describe('/PUT User Recipes Test', () => {
  it('should modify and return a recipe', (done) => {
    chai.request(server)
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
      chai.request(server)
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
      chai.request(server)
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

describe('/GET all Recipes Test', () => {
  it('should return an array of Recipes', (done) => {
    chai.request(server)
      .get('/api/v1/recipes')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('should return an array of Recipes sorted by most upvotes', (done) => {
    chai.request(server)
      .get('/api/v1/recipes?sort=upvotes&order=descending ')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
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
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('should delete a recipe', (done) => {
    chai.request(server)
      .delete(`/api/v1/recipes/${recipeId + 1}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it(`should return 'You cannot modify a recipe not created by You!' for id: 
${recipeId + 2}`,
  (done) => {
    chai.request(server)
      .delete(`/api/v1/recipes/${recipeId + 2}`)
      .set('Accept', 'application/json')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6M' +
        'zEzLCJlbWFpbCI6InNkc2RzbGFzc3NAZ21haWwuY29tIiwidXNlcm5hbWUiOiJsYXJy' +
        'eXN0b25lMSIsImlhdCI6MTUxMTAzMTcwNn0.LW0tTpc8l8YPp03kDxuoRDW-kcDoFgG' +
        'idApMoV5-3dg')
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body).deep.equal({
          success: false,
          message: 'You cannot modify a recipe not created by You!'
        });
        done();
      });
  });

  it('should delete a recipe', (done) => {
    chai.request(server)
      .delete(`/api/v1/recipes/${recipeId + 2}`)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('should return \'Recipe does not exist!\' for id: 100', (done) => {
    chai.request(server)
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

describe('/GET all Recipes Test', () => {
  it('should return an an empty array of Recipes', (done) => {
    chai.request(server)
      .get('/api/v1/recipes')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});

describe('/GET all Recipes by User Test', () => {
  it('should return an empty array of Recipes', (done) => {
    chai.request(server)
      .get('/api/v1/users/myRecipes')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});

