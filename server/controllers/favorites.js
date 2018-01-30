import { Favorite, Recipe, User } from '../models';

/**
 * Class Definition for the Favorites Object
 *
 * @export
 *
 * @class Favorites
 */
export default class Favorites {
  /**
   * @description - Adds a recipe to user favorite list
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @returns {object} this - Favorites class instance
   *
   * @memberof Favorites
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
            message: 'Recipe added to favorites!'
          });
        }

        return res.status(409).json({
          success: false,
          message: 'Recipe already added!'
        });
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'Error adding recipe to favorite'
      }));

    return this;
  }

  /**
   * @description - Removes a recipe from user favorites
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Favorites class instance
   *
   * @memberof Favorites
   */
  removeFromFavorites({ params, user }, res) {
    const { recipeId } = params;
    const userId = user.id;
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
          res.status(200).json({
            success: true,
            message: `Recipe with ID: ${recipeId} Removed from Favorites`
          });
        }
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'Error removing recipe from favorites'
      }));
    return this;
  }

  /**
   * @description - Get a list of user's favorite recipes
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Favorite Class instance
   *
   * @memberof Favorites
   */
  getFavRecipes({ user }, res) {
    const userId = user.id;

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
        }).then(recipes => res.status(200).json({
          success: true,
          message: 'Favorite Recipes found',
          recipes
        }));
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'Error fetching favorite recipes'
      }));

    return this;
  }


  /**
 * @description - Get a user favorite recipe
 *
 * @param {object} req - HTTP Request
 *
 * @param {object} res - HTTP Response
 *
 * @return {object} this - Favorites Class instance
 *
 * @memberof Favorites
 */
  getFavRecipe({ params, user: { id } }, res) {
    const { recipeId } = params;
    const userId = id;

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
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'Error fetching favorite recipe'
      }));

    return this;
  }
}
