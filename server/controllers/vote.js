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
              .decrement('downvotes', { where: { id: recipeId } });
          });
      }
    });

  const newUpvote = upvote
    .findOrCreate({ where: { userId, recipeId } })
    .spread((createdVote, created) => {
      if (created) {
        recipe
          .increment('upvotes', { where: { id: recipeId } });

        return res.status(201).send({ message: 'Recipe Upvoted!' });
      }

      return res.status(201).send({ message: 'Already Upvoted!' });
    })
    // .then((createdReview) => {
    //   res.status(201).send(createdReview);
    // })
    .catch(() => res.status(401).send({ error: 'Error Upvoting Review' }));

  return newUpvote;
};

