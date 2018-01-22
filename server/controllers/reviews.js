import { Review, Recipe, User } from '../models';
import { validateReviewContent } from '../middleware/validate';
import trimWhiteSpaces from './../services/trimWhiteSpaces';

import * as Mailer from '../services/mailer';

const notify = new Mailer.default();
/**
 * @description - Class Definition for the Review Object
 *
 * @export
 *
 * @class Reviews
 */
export default class Reviews {
  /**
   * @description - Post a review on a recipe
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Class instance
   *
   * @memberof Reviews
   */
  postReview({ user, params, body }, res) {
    const userId = user.id;
    const { recipeId } = params;
    const message = trimWhiteSpaces(body.content, ' ');

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
          attributes: ['name', 'imageUrl'],
          where: { id: userId },
        })
          .then((reviewOwner) => {
            const { name, imageUrl } = reviewOwner;
            review.User = { name, imageUrl };
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
            notify.send({
              type: 'review',
              email: recipeOwnerEmail,
              reviewFrom: `${review.User.name}`,
              reviewMessage: `${review.content}`,
              reviewTime: `${review.createdAt}`
            });

            return res.status(201).json({
              success: true,
              message: 'New review created',
              createdReview: review
            });
          })
          .catch((/* error */) => res.status(500).json({
            success: false,
            message: 'Error posting review'
          }));
      });

    return this;
  }

  /**
 * @description - Get a list of reviews on a recipe
 *
 * @param {object} req - HTTP Request
 *
 * @param {object} res - HTTP Response
 *
 * @return {object} this - Class instance
 *
 * @memberof Reviews
 */
  getRecipeReviews({ params }, res) {
    const recipeId = params.recipeId;

    Review
      .findAll({
        where: { recipeId },
        include: [
          { model: User, attributes: ['name', 'imageUrl'] }
        ],
        order: [
          ['id', 'DESC']
        ]
      })
      .then((reviews) => {
        if (reviews.length === 0) {
          return res.status(404).json({
            success: true,
            message: 'Nothing found!',
            reviews: []
          });
        }
        return res.status(200).json({
          success: true,
          message: 'Review(s) found',
          reviews
        });
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'Error fetching reviews'
      }));

    return this;
  }

  /**
 * @description - Get a list of reviews by a user
 *
 * @param {object} req - HTTP Request
 *
 * @param {object} res - HTTP Response
 *
 * @return {object} this - Class instance
 *
 * @memberof Reviews
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
          return res.status(404).json({
            success: true,
            message: 'Nothing found!',
            reviews: []
          });
        }

        return res.status(200).json({
          success: true,
          message: 'User review(s) found',
          reviews
        });
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'Error fetching reviews'
      }));

    return this;
  }
}
