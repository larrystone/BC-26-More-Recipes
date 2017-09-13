import models from '../models';
import * as validate from '../middleware/validate';

const review = models.Review;
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
    const userId = req.userId;
    const recipeId = req.params.recipeId;
    const content = (req.body.content || '').replace(/\s+/g, ' ');

    const validateReviewContentError = validate.validateReviewContent(content);
    if (validateReviewContentError) {
      return res.status(400).json({
        success: false,
        message: validateReviewContentError });
    }

    review
      .create({
        content,
        userId,
        recipeId
      })
      .then((createdReview) => {
        res.status(201).json({
          success: true,
          message: 'New review created',
          createdReview });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Posting Review' }));

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
  getReviews(req, res) {
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
          data: reviews });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Fetching Reviews' }));

    return this;
  }
}
