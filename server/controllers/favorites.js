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
  addToFavorite(req, res) {
    const userId = req.user.id;
    const { recipeId } = req.params;

    Favorite
      .findOrCreate({ where: { userId, recipeId } })
      .spread((addedReceipe, created) => {
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
  removeFromFavorites(req, res) {
    const userId = req.params.userId;

    const recipeId = req.params.recipeId;
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
          message: 'Recipe Removed from Favorites'
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
  getFavRecipes(req, res) {
    const userId = req.params.userId;

    Favorite
      .findAll({
        where: { userId },
        include: [
          { model: Recipe }
        ]
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res.status(201).json({
            success: true,
            message: 'No Stored Favorite Recipes found',
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Favorite Recipe(s) found',
          recipe: foundRecipes
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to fetch favorite recipes'
      }));

    return this;
  }
}
