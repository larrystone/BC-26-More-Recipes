import { Review, Recipe, User } from '../models';
import { validateReviewContent } from '../middleware/validate';
import notify from './../services/notify';

/**
 * Class Definition for the Review Object
 *
 * @export
 * @class Review
 */
export default class Reviews {
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
    const { recipeId } = req.params;
    const content = (req.body.content || '').replace(/\s+/g, ' ');

    const validateReviewContentError = validateReviewContent(content);
    if (validateReviewContentError) {
      return res.status(400).json({
        success: false,
        message: validateReviewContentError
      });
    }

    Review
      .create({
        content,
        userId,
        recipeId
      })
      .then((createdReview) => {
        Recipe
          .findOne({
            attributes: ['userId'],
            where: { id: recipeId },
            include: [
              { model: User, attributes: ['email'] }
            ]
          })
          .then((recipeOwner) => {
            const recipeOwnerEmail = recipeOwner.User.email;
            notify(recipeOwnerEmail,
              'New Review on Recipe',
              'Someone recently posted a review on one of your Recipes'
            );

            return res.status(201).json({
              success: true,
              message: 'New review created',
              createdReview
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

    Review
      .findAll({
        where: { recipeId },
        include: [
          { model: User, attributes: ['name', 'updatedAt'] }
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

    Review
      .findAll({
        where: { userId },
        include: [
          { model: Recipe }
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
