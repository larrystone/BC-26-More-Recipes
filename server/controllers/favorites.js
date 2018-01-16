import { Favorite, Recipe, User } from '../models';

/**
 * Class Definition for the Favorite Object
 *
 * @export
 * @class Favorite
 */
export default class Favorites {
  /**
   * Add a recipe to user favorite
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Favorite
   */
  addToFavorites({ user, params }, res) {
    const userId = user.id;
    const { recipeId } = params;

    Favorite
      .findOrCreate({ where: { userId, recipeId } })
      .spread((addedRecipe, created) => {
        if (created) {
          return res.status(201).json({
            success: true,
            message: `Recipe with id: ${recipeId} added to favorites!`
          });
        }

        return res.status(409).json({
          success: false,
          message: `Recipe with id: ${recipeId} Already added!`
        });
      });

    return this;
  }

  /**
   * Remove a recipe from user favorites
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Favorite
   */
  removeFromFavorites({ params }, res) {
    const { recipeId, userId } = params;
    Favorite
      .destroy({
        where: {
          $and: [
            { userId },
            { recipeId }
          ]
        },
      })
      .then((status) => {
        if (status === 1) {
          res.status(205).json({
            success: true,
            message: `Recipe with ID: ${recipeId} Removed from Favorites`
          });
        }
      });

    return this;
  }

  /**
   * Get a list of user's favorite recipes
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Favorite
   */
  getFavRecipes({ params }, res) {
    const { userId } = params;

    Favorite
      .findAll({
        where: { userId },
        attributes: ['recipeId']
      })
      .then((favorites) => {
        if (favorites.length === 0) {
          return res.status(404).json({
            success: true,
            message: 'Nothing found!',
            recipes: []
          });
        }

        const ids = favorites.map(recipe => recipe.recipeId);
        Recipe.findAll({
          where: { id: ids },
          include: [
            { model: User, attributes: ['name'] }
          ]
        }).then(recipes => res.status(201).json({
          success: true,
          message: 'Favorite Recipes found',
          recipes
        }));
      });

    return this;
  }


  /**
 * Get a single user favorite
 *
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 * @returns {object} Class instance
 * @memberof Favorite
 */
  getSingleFavorite({ params }, res) {
    const { userId, recipeId } = params;

    Favorite
      .findOne({
        where: { userId, recipeId },
        attributes: ['recipeId']
      })
      .then((recipe) => {
        if (!recipe) {
          return res.status(404).json({
            success: true,
            message: 'Nothing found!',
            recipe: {}
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Favorite Recipe found',
          recipe
        });
      });

    return this;
  }
}
