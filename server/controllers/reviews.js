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
  postReview({ user, params, body }, res) {
    const userId = user.id;
    const { recipeId } = params;
    const content = (body.content || '').replace(/\s+/g, ' ');

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
  getRecipeReviews({ params }, res) {
    const recipeId = params.recipeId;

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
          reviews
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
  getUserReviews({ params }, res) {
    const { userId } = params;

    Review
      .findAll({
        where: { userId },
        include: [
          { model: Recipe }
        ]
      })
      .then((reviews) => {
        if (!reviews) {
          return res.status(201).json({
            success: true,
            message: 'No Recipes Review by User found',
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Operation Successful',
          reviews
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to fetch recipes reviews'
      }));

    return this;
  }
}
