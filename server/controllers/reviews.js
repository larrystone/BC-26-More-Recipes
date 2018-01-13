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
    const message = (body.content || '').replace(/\s+/g, ' ');

    const validateReviewContentError = validateReviewContent(message);
    if (validateReviewContentError) {
      return res.status(400).json({
        success: false,
        message: validateReviewContentError
      });
    }

    Review
      .create({
        content: message,
        userId,
        recipeId
      })
      .then((createdReview) => {
        const { id, content, createdAt } = createdReview;
        const review = { id, content, createdAt };

        User.findOne({
          attributes: ['name'],
          where: { id: userId },
        })
          .then((reviewOwner) => {
            const { name } = reviewOwner;
            review.User = { name };
          });

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
              `${review.User.name} recently` +
              'posted a review on one of your Recipes'
            );

            return res.status(201).json({
              success: true,
              message: 'New review created',
              createdReview: review
            });
          });
      });

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
          { model: User, attributes: ['name'] }
        ],
        order: [
          ['id', 'DESC']
        ]
      })
      .then((reviews) => {
        if (reviews.length === 0) {
          return res.status(200).json({
            success: true,
            message: 'Nothing found',
            reviews: []
          });
        }
        return res.status(201).json({
          success: true,
          message: 'Review(s) found',
          reviews
        });
      });

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
        if (reviews.length === 0) {
          return res.status(200).json({
            success: true,
            message: 'Nothing found!',
            reviews: []
          });
        }

        return res.status(201).json({
          success: true,
          message: 'User review(s) found',
          reviews
        });
      });

    return this;
  }
}
