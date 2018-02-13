/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { Recipe, Favorite } from '../../models';
import * as seedData from '../../seedData/testSeedData';

let recipeId;
let userId;

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
        recipeId = recipe.dataValues.id;
        userId = recipe.dataValues.id;
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

  it('should create a new favorite record', (done) => {
    Favorite.create(seedData.validFavorite)
      .then((favorite) => {
        expect(favorite.dataValues).to.have.property('id');
        expect(favorite.dataValues).to.have.property('recipeId');
        expect(favorite.dataValues).to.have.property('userId');
        expect(favorite.dataValues.recipeId)
          .to.equal(seedData.validFavorite.recipeId);
        expect(favorite.dataValues.userId)
          .to.equal(seedData.validFavorite.userId);
        done();
      });
  });

  it(
    'should throw a validation error for an invalid recipeId ',
    (done) => {
      Favorite.create(seedData.inValidRecipeId)
        .catch((error) => {
          expect(error.message)
            .to.equal('insert or update on table "Favorites" ' +
            'violates foreign key constraint "Favorites_recipeId_fkey"');
          done();
        });
    }
  );

  it(
    'should throw a validation error for an invalid userId ',
    (done) => {
      Favorite.create(seedData.inValidUserId)
        .catch((error) => {
          expect(error.message)
            .to.equal('insert or update on table "Favorites" violates ' +
            'foreign key constraint "Favorites_userId_fkey"');
          done();
        });
    }
  );

  it('should be able to find all favorite recipes by userId', (done) => {
    Favorite.findAll({
      where: {
        userId
      }
    })
      .then((favorite) => {
        expect(favorite).to.be.an('array');
        expect(favorite.length).to.equal(1);
        expect(favorite[0].dataValues).to.have.property('id');
        expect(favorite[0].dataValues).to.have.property('recipeId');
        expect(favorite[0].dataValues).to.have.property('userId');
        expect(favorite[0].dataValues.id).to.equal(recipeId);
        expect(favorite[0].dataValues.recipeId)
          .to.equal(seedData.validFavorite.recipeId);
        expect(favorite[0].dataValues.userId)
          .to.equal(seedData.validFavorite.userId);
        done();
      });
  });

  it('should be able to find all favorite recipes by recipeId', (done) => {
    Favorite.findAll({
      where: {
        recipeId
      }
    })
      .then((favorite) => {
        expect(favorite).to.be.an('array');
        expect(favorite.length).to.equal(1);
        expect(favorite[0].dataValues).to.have.property('id');
        expect(favorite[0].dataValues).to.have.property('recipeId');
        expect(favorite[0].dataValues).to.have.property('userId');
        expect(favorite[0].dataValues.id).to.equal(recipeId);
        expect(favorite[0].dataValues.recipeId)
          .to.equal(seedData.validFavorite.recipeId);
        expect(favorite[0].dataValues.userId)
          .to.equal(seedData.validFavorite.userId);
        done();
      });
  });
});
