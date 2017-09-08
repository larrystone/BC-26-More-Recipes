import models from '../models';
import * as validate from '../middleware/validate';

const review = models.Review;

/** Post a review on a recipe
 * @exports postReview
 * @param  {object} req - request
 * @param  {object} res - response
 * @return {object} The status/created review
 */
export const postReview = (req, res) => {
  const userId = req.userId;
  const recipeId = req.params.recipeId;
  const content = (req.body.content || '').replace(/\s+/g, ' ');

  const validateReviewContentError = validate.validateReviewContent(content);
  if (validateReviewContentError) {
    return res.status(403).json({
      success: false,
      message: validateReviewContentError });
  }

  const newReview = review
    .create({
      content,
      userId,
      recipeId
    })
    .then((createdReview) => {
      res.status(201).json({
        success: true,
        createdReview });
    })
    .catch(() => res.status(503).json({
      success: false,
      message: 'Error Posting Review' }));

  return newReview;
};

/** Get a list of reviews on a recipe
 * @exports getReviews
 * @param  {object} req - request
 * @param  {object} res - response
 * @return {object} The status/reviews fetched
 */
export const getReviews = (req, res) => {
  const recipeId = req.params.recipeId;
  const newReview = review
    .findAll({
      where: { recipeId },
      include: [
        { model: models.User, attributes: ['name', 'updatedAt'] }
      ]
    })
    .then((reviews) => {
      res.status(201).json({
        success: true,
        data: reviews });
    })
    .catch(() => res.status(503).json({
      success: false,
      message: 'Error Fetching Reviews' }));

  return newReview;
};
