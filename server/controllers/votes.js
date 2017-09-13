import models from '../models';

const upvote = models.Upvote;
const downvote = models.Downvote;
const recipe = models.Recipe;

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

    upvote
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

        return res.status(409).json({
          success: false,
          message: `Recipe with id: ${recipeId} Already Upvoted!` });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Upvoting Recipe' }));

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

    downvote
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

        return res.status(409).json({
          success: false,
          message: `Recipe with id: ${recipeId} Already Downvoted!` });
      })
      .catch(() => res.status(500).json({
        success: true,
        message: 'Error Downvoting Recipe' }));

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
    const recipeId = req.params.recipeId;

    upvote
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
          message: 'User upvotes found',
          data: foundVotes });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to get user upvotes' }));

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
    const recipeId = req.params.recipeId;

    downvote
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
          message: 'User downvotes found',
          data: foundVotes });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to get user downvotes' }));

    return this;
  }
}
