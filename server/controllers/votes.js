import models from '../models';

const upvote = models.Upvote;
const downvote = models.Downvote;
const recipe = models.Recipe;

/** Upvote a Recipe
 * @exports upvoteRecipe
 * @param  {object} req - request
 * @param  {object} res - response 
 * @return {object} The status of upvote
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
        return res.status(201).json({
          success: true,
          message: `Recipe with id: ${recipeId} Upvoted!` });
      }

      return res.status(201).json({
        success: false,
        message: `Recipe with id: ${recipeId} Already Upvoted!` });
    })
    .catch(() => res.status(503).json({
      success: false,
      message: 'Error Upvoting Recipe' }));

  return newUpvote;
};

/** Downvote a recipe
 * @exports downvoteRecipe
 * @param  {object} req - request
 * @param  {object} res - response 
 * @return {object} The status of downvote
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

        return res.status(201).json({
          success: true,
          message: `Recipe with id: ${recipeId} Downvoted!` });
      }

      return res.status(201).json({
        success: false,
        message: `Recipe with id: ${recipeId} Already Downvoted!` });
    })
    .catch(() => res.status(503).json({
      success: true,
      message: 'Error Downvoting Recipe' }));

  return newDownvote;
};

/** Fetch a list of users that upvoted a recipe
 * @exports getUserUpvotes
 * @param  {object} req - request
 * @param  {object} res - response 
 * @return {object} The status/user lists
 */
export const getUserUpvotes = (req, res) => {
  const recipeId = req.params.recipeId;
  const upvotes = upvote
    .findAll({
      attributes: ['recipeId'],
      where: { recipeId },
      include: [
        { model: models.User, attributes: ['name'] }
      ]
    })
    .then((foundVotes) => {
      if (!foundVotes) {
        return res.status(201).json({
          success: true,
          message: 'No User Upvoted this Recipe!'
        });
      }

      return res.status(201).json({
        success: true,
        data: foundVotes });
    })
    .catch(() => res.status(503).json({
      success: false,
      message: 'Unable to get user upvotes' }));

  return upvotes;
};

/** Fetch a list of users that downvoted a recipe
 * @exports getUserDownvotes
 * @param  {object} req - request
 * @param  {object} res - response 
 * @return {object} The status/user lists
 */
export const getUserDownvotes = (req, res) => {
  const recipeId = req.params.recipeId;
  const downvotes = downvote
    .findAll({
      attributes: ['recipeId'],
      where: { recipeId },
      include: [
        { model: models.User, attributes: ['name'] }
      ]
    })
    .then((foundVotes) => {
      if (!foundVotes) {
        return res.status(201).json({
          success: true,
          message: 'No User Downvoted this Recipe!'
        });
      }

      return res.status(201).json({
        success: true,
        data: foundVotes });
    })
    .catch(() => res.status(503).json({
      success: false,
      message: 'Unable to get user downvotes' }));

  return downvotes;
};
