/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { Recipe, Upvote, Downvote } from '../../models';
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

  it('should create a new upvote record', (done) => {
    Upvote.create(seedData.validVote)
      .then((upvote) => {
        expect(upvote.dataValues).to.have.property('id');
        expect(upvote.dataValues).to.have.property('recipeId');
        expect(upvote.dataValues).to.have.property('userId');
        expect(upvote.dataValues.recipeId)
          .to.equal(seedData.validVote.recipeId);
        expect(upvote.dataValues.userId)
          .to.equal(seedData.validVote.userId);
        done();
      });
  });

  it(
    'should throw a validation error for an invalid recipeId on upvote action',
    (done) => {
      Upvote.create(seedData.inValidRecipeId)
        .catch((error) => {
          expect(error.message)
            .to.equal('insert or update on table "Upvotes" ' +
            'violates foreign key constraint "Upvotes_recipeId_fkey"');
          done();
        });
    }
  );

  it(
    'should throw a validation error for an invalid userId on upvote action',
    (done) => {
      Upvote.create(seedData.inValidUserId)
        .catch((error) => {
          expect(error.message)
            .to.equal('insert or update on table "Upvotes" violates ' +
            'foreign key constraint "Upvotes_userId_fkey"');
          done();
        });
    }
  );

  it('should create a new downvote record', (done) => {
    Downvote.create(seedData.validVote)
      .then((downvote) => {
        expect(downvote.dataValues).to.have.property('id');
        expect(downvote.dataValues).to.have.property('recipeId');
        expect(downvote.dataValues).to.have.property('userId');
        expect(downvote.dataValues.recipeId)
          .to.equal(seedData.validVote.recipeId);
        expect(downvote.dataValues.userId)
          .to.equal(seedData.validVote.userId);
        done();
      });
  });

  it(
    'should throw a validation error for an invalid recipeId on downvote action',
    (done) => {
      Downvote.create(seedData.inValidRecipeId)
        .catch((error) => {
          expect(error.message)
            .to.equal('insert or update on table "Downvotes" ' +
            'violates foreign key constraint "Downvotes_recipeId_fkey"');
          done();
        });
    }
  );

  it(
    'should throw a validation error for an invalid userId on downvote action',
    (done) => {
      Downvote.create(seedData.inValidUserId)
        .catch((error) => {
          expect(error.message)
            .to.equal('insert or update on table "Downvotes" violates ' +
            'foreign key constraint "Downvotes_userId_fkey"');
          done();
        });
    }
  );

  it('should be able to find all upvotes by recipeId', (done) => {
    Upvote.findAll({
      where: {
        recipeId
      }
    })
      .then((upvote) => {
        expect(upvote).to.be.an('array');
        expect(upvote.length).to.equal(1);
        expect(upvote[0].dataValues).to.have.property('id');
        expect(upvote[0].dataValues).to.have.property('recipeId');
        expect(upvote[0].dataValues).to.have.property('userId');
        expect(upvote[0].dataValues.id).to.equal(recipeId);
        expect(upvote[0].dataValues.recipeId)
          .to.equal(seedData.validVote.recipeId);
        expect(upvote[0].dataValues.userId)
          .to.equal(seedData.validVote.userId);
        done();
      });
  });

  it('should be able to find all downvotes by recipeId', (done) => {
    Downvote.findAll({
      where: {
        recipeId
      }
    })
      .then((downvote) => {
        expect(downvote).to.be.an('array');
        expect(downvote.length).to.equal(1);
        expect(downvote[0].dataValues).to.have.property('id');
        expect(downvote[0].dataValues).to.have.property('recipeId');
        expect(downvote[0].dataValues).to.have.property('userId');
        expect(downvote[0].dataValues.id).to.equal(recipeId);
        expect(downvote[0].dataValues.recipeId)
          .to.equal(seedData.validVote.recipeId);
        expect(downvote[0].dataValues.userId)
          .to.equal(seedData.validVote.userId);
        done();
      });
  });

  it('should be able to find all downvotes by userId', (done) => {
    Downvote.findAll({
      where: {
        userId
      }
    })
      .then((downvote) => {
        expect(downvote).to.be.an('array');
        expect(downvote.length).to.equal(1);
        expect(downvote[0].dataValues).to.have.property('id');
        expect(downvote[0].dataValues).to.have.property('recipeId');
        expect(downvote[0].dataValues).to.have.property('userId');
        expect(downvote[0].dataValues.id).to.equal(recipeId);
        expect(downvote[0].dataValues.recipeId)
          .to.equal(seedData.validVote.recipeId);
        expect(downvote[0].dataValues.userId)
          .to.equal(seedData.validVote.userId);
        done();
      });
  });
});
