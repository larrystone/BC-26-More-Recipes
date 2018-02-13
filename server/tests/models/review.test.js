/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { Recipe, Review } from '../../models';
import * as seedData from '../../seedData/testSeedData';

let reviewId;
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

  it('should create a new review', (done) => {
    Review.create(seedData.validReview)
      .then((review) => {
        reviewId = review.dataValues.id;
        expect(review.dataValues).to.have.property('id');
        expect(review.dataValues).to.have.property('content');
        expect(review.dataValues).to.have.property('recipeId');
        expect(review.dataValues).to.have.property('userId');
        expect(review.dataValues.content)
          .to.equal(seedData.validReview.content);
        expect(review.dataValues.userId)
          .to.equal(seedData.validReview.userId);
        expect(review.dataValues.recipeId)
          .to.equal(seedData.validReview.recipeId);
        done();
      });
  });

  it(
    'should throw a validation error for an empty review content',
    (done) => {
      Review.create(seedData.reviewWithNoContent)
        .catch((error) => {
          expect(error.errors[0].message)
            .to.equal('review cannot be empty');
          expect(error.errors[0].type).to.equal('Validation error');
          done();
        });
    }
  );

  it('should be able to find review by review Id', (done) => {
    Review.findById(reviewId)
      .then((review) => {
        expect(review.dataValues).to.have.property('id');
        expect(review.dataValues).to.have.property('content');
        expect(review.dataValues).to.have.property('recipeId');
        expect(review.dataValues).to.have.property('userId');
        expect(review.dataValues.id).to.equal(recipeId);
        expect(review.dataValues.content)
          .to.equal(seedData.validReview.content);
        expect(review.dataValues.userId)
          .to.equal(seedData.validReview.userId);
        done();
      });
  });

  it('should be able to find review by userId', (done) => {
    Review.findAll({
      where: {
        userId
      }
    })
      .then((review) => {
        expect(review).to.be.an('array');
        expect(review.length).to.equal(1);
        expect(review[0].dataValues).to.have.property('id');
        expect(review[0].dataValues).to.have.property('content');
        expect(review[0].dataValues).to.have.property('recipeId');
        expect(review[0].dataValues).to.have.property('userId');
        expect(review[0].dataValues.id).to.equal(recipeId);
        expect(review[0].dataValues.content)
          .to.equal(seedData.validReview.content);
        expect(review[0].dataValues.userId)
          .to.equal(seedData.validReview.userId);
        done();
      });
  });

  it('should be able to find review by recipeId', (done) => {
    Review.findAll({
      where: {
        recipeId
      }
    })
      .then((review) => {
        expect(review).to.be.an('array');
        expect(review.length).to.equal(1);
        expect(review[0].dataValues).to.have.property('id');
        expect(review[0].dataValues).to.have.property('content');
        expect(review[0].dataValues).to.have.property('recipeId');
        expect(review[0].dataValues).to.have.property('userId');
        expect(review[0].dataValues.id).to.equal(recipeId);
        expect(review[0].dataValues.content)
          .to.equal(seedData.validReview.content);
        expect(review[0].dataValues.userId)
          .to.equal(seedData.validReview.userId);
        done();
      });
  });
});
