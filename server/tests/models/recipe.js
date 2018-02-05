/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { Recipe } from '../../models';
import * as seedData from '../../seedData/testSeedData';

let name;
let userId;
let recipeId;

describe('RECIPE MODEL', () => {
  before((done) => {
    Recipe.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
      .then(() => {
        done();
      });
  });
  it('should create a new recipe', (done) => {
    Recipe.create(seedData.validRecipe)
      .then((recipe) => {
        name = recipe.dataValues.name;
        recipeId = recipe.dataValues.id;
        userId = recipe.dataValues.userId;
        expect(recipe.dataValues).to.have.property('id');
        expect(recipe.dataValues).to.have.property('name');
        expect(recipe.dataValues).to.have.property('description');
        expect(recipe.dataValues).to.have.property('ingredients');
        expect(recipe.dataValues).to.have.property('createdAt');
        expect(recipe.dataValues).to.have.property('updatedAt');
        expect(recipe.dataValues).to.have.property('downvotes');
        expect(recipe.dataValues).to.have.property('upvotes');
        expect(recipe.dataValues.name).to.equal(seedData.validRecipe.name);
        expect(recipe.dataValues.description)
          .to.equal(seedData.validRecipe.description);
        expect(recipe.dataValues.ingredients)
          .to.equal(seedData.validRecipe.ingredients);
        expect(recipe.dataValues.createdAt).to.exist;
        expect(recipe.dataValues.updatedAt).to.exist;
        expect(recipe.dataValues.viewCount).to.exist;
        done();
      });
  });
  it(
    'should throw a validation error for an empty recipe name ',
    (done) => {
      Recipe.create(seedData.recipeWithNoName)
        .catch((error) => {
          expect(error.errors[0].message)
            .to.equal('recipe name cannot be empty');
          expect(error.errors[0].type).to.equal('Validation error');
          done();
        });
    }
  );
  it('should throw a validation error for an empty ingredient list', (done) => {
    Recipe.create(seedData.recipeWithNoIngredient)
      .catch((error) => {
        expect(error.errors).to.be.an('array');
        expect(error.errors[0].message).to.equal('ingredients cannot be empty');
        expect(error.errors[0].type).to.equal('Validation error');
        done();
      });
  });
  it('should throw a validation error for a null procedure ', (done) => {
    Recipe.create(seedData.recipeWithNoProcedure)
      .catch((error) => {
        expect(error.errors).to.be.an('array');
        expect(error.errors[0].message).to.equal('enter procedure clearly');
        expect(error.errors[0].type).to.equal('Validation error');
        done();
      });
  });

  it('should be able to find recipe by Id', (done) => {
    Recipe.findById(recipeId)
      .then((recipe) => {
        expect(recipe.dataValues).to.have.property('id');
        expect(recipe.dataValues).to.have.property('name');
        expect(recipe.dataValues).to.have.property('description');
        expect(recipe.dataValues).to.have.property('createdAt');
        expect(recipe.dataValues).to.have.property('updatedAt');
        expect(recipe.dataValues).to.have.property('ingredients');
        expect(recipe.dataValues.id).to.equal(recipeId);
        expect(recipe.dataValues.name).to.equal(seedData.validRecipe.name);
        expect(recipe.dataValues.description)
          .to.equal(seedData.validRecipe.description);
        expect(recipe.dataValues.createdAt).to.exist;
        expect(recipe.dataValues.updatedAt).to.exist;
        done();
      });
  });

  it('should be able to find recipe by name', (done) => {
    Recipe.findOne({
      where: {
        name
      }
    })
      .then((recipe) => {
        expect(recipe.dataValues).to.have.property('id');
        expect(recipe.dataValues).to.have.property('name');
        expect(recipe.dataValues).to.have.property('description');
        expect(recipe.dataValues).to.have.property('createdAt');
        expect(recipe.dataValues).to.have.property('updatedAt');
        expect(recipe.dataValues).to.have.property('ingredients');
        expect(recipe.dataValues.id).to.equal(recipeId);
        expect(recipe.dataValues.name).to.equal(seedData.validRecipe.name);
        expect(recipe.dataValues.description)
          .to.equal(seedData.validRecipe.description);
        expect(recipe.dataValues.createdAt).to.exist;
        expect(recipe.dataValues.updatedAt).to.exist;
        done();
      });
  });

  it('should be able to find recipe by userId', (done) => {
    Recipe.findAll({
      where: {
        userId
      }
    })
      .then((recipe) => {
        expect(recipe).to.be.an('array');
        expect(recipe.length).to.equal(1);
        expect(recipe[0].dataValues).to.have.property('id');
        expect(recipe[0].dataValues).to.have.property('name');
        expect(recipe[0].dataValues).to.have.property('description');
        expect(recipe[0].dataValues).to.have.property('ingredients');
        expect(recipe[0].dataValues).to.have.property('procedure');
        expect(recipe[0].dataValues.id).to.equal(recipeId);
        expect(recipe[0].dataValues.name).to.equal(seedData.validRecipe.name);
        expect(recipe[0].dataValues.ingredients)
          .to.equal(seedData.validRecipe.ingredients);
        expect(recipe[0].dataValues.procedure)
          .to.equal(seedData.validRecipe.procedure);
        done();
      });
  });

  it('should be able to find all recipes in the database', (done) => {
    Recipe.findAll()
      .then((recipe) => {
        expect(recipe).to.be.an('array');
        expect(recipe.length).to.equal(1);
        expect(recipe[0].dataValues).to.have.property('id');
        expect(recipe[0].dataValues).to.have.property('name');
        expect(recipe[0].dataValues).to.have.property('description');
        expect(recipe[0].dataValues).to.have.property('ingredients');
        expect(recipe[0].dataValues).to.have.property('procedure');
        expect(recipe[0].dataValues.id).to.equal(recipeId);
        expect(recipe[0].dataValues.name).to.equal(seedData.validRecipe.name);
        expect(recipe[0].dataValues.ingredients)
          .to.equal(seedData.validRecipe.ingredients);
        expect(recipe[0].dataValues.procedure)
          .to.equal(seedData.validRecipe.procedure);
        done();
      });
  });
});
