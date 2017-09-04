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
        return res.status(201).send({ message: 'Recipe Upvoted!' });
      }

      return res.status(201).send({ message: 'Already Upvoted!' });
    })
    .catch(() => res.status(401).send({ error: 'Error Upvoting Review' }));

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

        return res.status(201).send({ message: 'Recipe Downvoted!' });
      }

      return res.status(201).send({ message: 'Already Downvoted!' });
    })
    .catch(() => res.status(401).send({ error: 'Error Downvoting Review' }));

  return newDownvote;
};
