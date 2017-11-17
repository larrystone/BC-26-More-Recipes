import { Favorite, Recipe } from '../models';

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
  addToFavorite({ user, params }, res) {
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
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Adding Recipe to Favorites'
      }));

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
      .then(() => {
        res.status(205).json({
          success: true,
          message: `Recipe with ID: ${recipeId} Removed from Favorites`
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Removing Recipe from Favorites'
      }));

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
        include: [
          { model: Recipe }
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
          message: 'Favorite Recipes found',
          recipe
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to fetch favorite recipes'
      }));

    return this;
  }
}
