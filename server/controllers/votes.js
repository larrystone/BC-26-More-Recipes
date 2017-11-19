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
  upvoteRecipe({ user, params }, res) {
    const userId = user.id;
    const { recipeId } = params;

    Downvote
      .destroy({
        where: {
          $and: [
            { userId },
            { recipeId }
          ]
        }
      })
      .then((response) => {
        if (response === 1) {
          Recipe
            .findOne({
              where: {
                id: recipeId
              }
            }).then((option) => {
              option.decrement('downvotes');
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
      });

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
  downvoteRecipe({ user, params }, res) {
    const userId = user.id;
    const { recipeId } = params;

    Upvote
      .destroy({
        where: {
          $and: [
            { userId },
            { recipeId }
          ]
        }
      })
      .then((response) => {
        if (response === 1) {
          Recipe
            .findOne({
              where: {
                id: recipeId
              }
            }).then((option) => {
              option.decrement('upvotes');
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
      });

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
  getUserUpvotes({ params }, res) {
    const { recipeId } = params;

    Upvote
      .findAll({
        attributes: ['recipeId'],
        where: { recipeId },
        include: [
          { model: User, attributes: ['name', 'id'] }
        ]
      })
      .then((recipe) => {
        if (recipe.length === 0) {
          return res.status(200).json({
            success: true,
            message: 'Nothing found!',
            recipe: []
          });
        }

        return res.status(201).json({
          success: true,
          message: 'User upvotes found',
          recipe
        });
      });

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
  getUserDownvotes({ params }, res) {
    const { recipeId } = params;

    Downvote
      .findAll({
        attributes: ['recipeId'],
        where: { recipeId },
        include: [
          { model: User, attributes: ['name', 'id'] }
        ]
      })
      .then((recipe) => {
        if (recipe.length === 0) {
          return res.status(200).json({
            success: true,
            message: 'Nothing found!',
            recipe: []
          });
        }

        return res.status(201).json({
          success: true,
          message: 'User donwvotes found',
          recipe
        });
      });

    return this;
  }
}
