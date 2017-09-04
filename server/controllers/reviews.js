import models from '../models';

const review = models.Review;

/**
 * @exports postReview
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const postReview = (req, res) => {
  const userId = req.userId;
  const recipeId = req.params.recipeId;
  const content = req.body.content;
  const newReview = review
    .create({
      content,
      userId,
      recipeId
    })
    .then((createdReview) => {
      createdReview.success = true;
      res.status(201).send(createdReview);
    })
    .catch(() => res.status(401).send({
      success: false,
      message: 'Error Posting Review' }));

  return newReview;
};

/**
 * @exports getReviews
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
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
      reviews.success = true;
      res.status(201).send(reviews);
    })
    .catch(() => res.status(401).send({
      success: false,
      error: 'Error Fetching Reviews' }));

  return newReview;
};
