import models from '../models';
import * as validate from '../middleware/validate';
import * as notify from './../services/notify';

const review = models.Review;
const recipe = models.Recipe;

/**
 * Class Definition for the Review Object
 *
 * @export
 * @class Review
 */
export default class Review {
  /**
   * Post a review on a recipe
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Review
   */
  postReview(req, res) {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;
    const content = (req.body.content || '').replace(/\s+/g, ' ');

    const validateReviewContentError = validate.validateReviewContent(content);
    if (validateReviewContentError) {
      return res.status(400).json({
        success: false,
        message: validateReviewContentError
      });
    }

    review
      .create({
        content,
        userId,
        recipeId
      })
      .then((createdReview) => {
        recipe
          .findOne({
            attributes: ['userId'],
            where: { id: recipeId },
            include: [
              { model: models.User, attributes: ['email'] }
            ]
          })
          .then((recipeOwner) => {
            const recipeOwnerEmail = recipeOwner.User.email;
            notify.default(recipeOwnerEmail,
              'New Review on Recipe',
              'Someone recently posted a review on one of your Recipes'
            );

            return res.status(201).json({
              success: true,
              message: 'New review created',
              createdReview,
              recipeOwnerEmail
            });
          });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Posting Review'
      }));

    return this;
  }

  /**
   * Get a list of reviews on a recipe
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Review
   */
  getRecipeReviews(req, res) {
    const recipeId = req.params.recipeId;

    review
      .findAll({
        where: { recipeId },
        include: [
          { model: models.User, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((reviews) => {
        res.status(201).json({
          success: true,
          message: 'Reviews found',
          recipe: reviews
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Fetching Reviews'
      }));

    return this;
  }

  /**
   * Get a list of reviews by a user
   * 
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Review
   */
  getUserReviews(req, res) {
    const userId = req.params.userId;

    review
      .findAll({
        where: { userId },
        include: [
          { model: models.Recipe }
        ]
      })
      .then((foundReviews) => {
        if (!foundReviews) {
          return res.status(201).json({
            success: true,
            message: 'No Recipes Review by User found',
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Recipe(s) Review by user found',
          recipe: foundReviews
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to fetch recipes reviews'
      }));

    return this;
  }
}
