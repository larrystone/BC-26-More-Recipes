import { Upvote, Downvote, Recipe, User } from '../models';

/**
 * Class Definition for the Vote Object
 *
 * @export
 * @class Vote
 */
export default class Vote {
  /**
   * Upvote a Recipe
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Vote
   */
  upvoteRecipe(req, res) {
    const userId = req.user.id;
    const { recipeId } = req.params;

    Downvote
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
          Downvote
            .destroy({
              where: {
                $and: [
                  { userId },
                  { recipeId }
                ]
              }
            })
            .then(() => {
              Recipe
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

    Upvote
      .findOrCreate({ where: { userId, recipeId } })
      .spread((createdVote, created) => {
        if (created) {
          Recipe
            .findOne({
              where: {
                id: recipeId
              }
            }).then((option) => {
              option.increment('upvotes');
            });
          return res.status(201).json({
            success: true,
            message: `Recipe with id: ${recipeId} Upvoted!`
          });
        }

        return res.status(409).json({
          success: false,
          message: `Recipe with id: ${recipeId} Already Upvoted!`
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Upvoting Recipe'
      }));

    return this;
  }

  /**
   * Downvote a recipe
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Vote
   */
  downvoteRecipe(req, res) {
    const userId = req.user.id;
    const { recipeId } = req.params;

    Upvote
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
          Upvote
            .destroy({
              where: {
                $and: [
                  { userId },
                  { recipeId }
                ]
              }
            })
            .then(() => {
              Recipe
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

    Downvote
      .findOrCreate({ where: { userId, recipeId } })
      .spread((createdVote, created) => {
        if (created) {
          Recipe
            .findOne({
              where: {
                id: recipeId
              }
            }).then((option) => {
              option.increment('downvotes');
            });

          return res.status(201).json({
            success: true,
            message: `Recipe with id: ${recipeId} Downvoted!`
          });
        }

        return res.status(409).json({
          success: false,
          message: `Recipe with id: ${recipeId} Already Downvoted!`
        });
      })
      .catch(() => res.status(500).json({
        success: true,
        message: 'Error Downvoting Recipe'
      }));

    return this;
  }

  /**
   * Fetch a list of users that upvoted a recipe
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {obejct} Class instance
   * @memberof Vote
   */
  getUserUpvotes(req, res) {
    const { recipeId } = req.params;

    Upvote
      .findAll({
        attributes: ['recipeId'],
        where: { recipeId },
        include: [
          { model: User, attributes: ['name', 'id'] }
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
          message: 'User upvotes found',
          recipe: foundVotes
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to get user upvotes'
      }));

    return this;
  }

  /**
   * Fetch a list of users that downvoted a recipe
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Vote
   */
  getUserDownvotes(req, res) {
    const { recipeId } = req.params;

    Downvote
      .findAll({
        attributes: ['recipeId'],
        where: { recipeId },
        include: [
          { model: User, attributes: ['name', 'id'] }
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
          message: 'User downvotes found',
          recipe: foundVotes
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to get user downvotes'
      }));

    return this;
  }
}
