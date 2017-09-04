import models from '../models';

const upvote = models.Upvote;
const downvote = models.Downvote;
const recipe = models.Recipe;

/**
 * @exports upvoteRecipe
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const upvoteRecipe = (req, res) => {
  const userId = req.userId;
  const recipeId = req.params.recipeId;

  downvote
    .findOne({
      attributes: ['id'],
      where: {
        $and: [
          { userId },
          { recipeId }
        ]
      }
    })
    .then((voteFound) => {
      if (voteFound) {
        downvote
          .destroy({
            where: {
              $and: [
                { userId },
                { recipeId }
              ]
            }
          })
          .then(() => {
            recipe
              .findOne({
                where: {
                  id: recipeId
                }
              }).then((option) => {
                option.decrement('downvotes');
              });
          });
      }
    });

  const newUpvote = upvote
    .findOrCreate({ where: { userId, recipeId } })
    .spread((createdVote, created) => {
      if (created) {
        recipe
          .findOne({
            where: {
              id: recipeId
            }
          }).then((option) => {
            option.increment('upvotes');
          });
        return res.status(201).send({
          success: true,
          message: 'Recipe Upvoted!' });
      }

      return res.status(201).send({
        success: false,
        message: 'Recipe Already Upvoted!' });
    })
    .catch(() => res.status(503).send({
      success: false,
      message: 'Error Upvoting Review' }));

  return newUpvote;
};

/**
 * @exports downvoteRecipe
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const downvoteRecipe = (req, res) => {
  const userId = req.userId;
  const recipeId = req.params.recipeId;

  upvote
    .findOne({
      attributes: ['id'],
      where: {
        $and: [
          { userId },
          { recipeId }
        ]
      }
    })
    .then((voteFound) => {
      if (voteFound) {
        upvote
          .destroy({
            where: {
              $and: [
                { userId },
                { recipeId }
              ]
            }
          })
          .then(() => {
            recipe
              .findOne({
                where: {
                  id: recipeId
                }
              }).then((option) => {
                option.decrement('upvotes');
              });
          });
      }
    });

  const newDownvote = downvote
    .findOrCreate({ where: { userId, recipeId } })
    .spread((createdVote, created) => {
      if (created) {
        recipe
          .findOne({
            where: {
              id: recipeId
            }
          }).then((option) => {
            option.increment('downvotes');
          });

        return res.status(201).send({
          success: true,
          message: 'Recipe Downvoted!' });
      }

      return res.status(201).send({
        success: false,
        message: 'Recipe Already Downvoted!' });
    })
    .catch(() => res.status(503).send({
      success: true,
      message: 'Error Downvoting Review' }));

  return newDownvote;
};

/**
 * @exports getUserUpvotes
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const getUserUpvotes = (req, res) => {
  const recipeId = req.params.recipeId;
  const upvotes = upvote
    .findAll({
      attributes: ['recipId'],
      where: { recipeId },
      include: [
        { model: models.User, attributes: ['name'] }
      ]
    })
    .then((foundVotes) => {
      if (!foundVotes) {
        return res.status(201).send({
          success: true,
          message: 'No User Upvoted this Recipe!'
        });
      }

      foundVotes.success = true;
      return res.status(201).send(foundVotes);
    })
    .catch(() => res.status(503).send({
      success: true,
      message: 'Unable to get user upvotes' }));

  return upvotes;
};

/**
 * @exports getUserDownvotes
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const getUserDownvotes = (req, res) => {
  const recipeId = req.params.recipeId;
  const downvotes = downvote
    .findAll({
      attributes: ['recipId'],
      where: { recipeId },
      include: [
        { model: models.User, attributes: ['name'] }
      ]
    })
    .then((foundVotes) => {
      if (!foundVotes) {
        return res.status(201).send({
          success: true,
          message: 'No User Downvoted this Recipe!'
        });
      }

      foundVotes.success = true;
      return res.status(201).send(foundVotes);
    })
    .catch(() => res.status(503).send({
      success: false,
      message: 'Unable to get user downvotes' }));

  return downvotes;
};
