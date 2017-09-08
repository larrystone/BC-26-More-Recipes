import models from '../models';
import * as validate from '../middleware/validate';

const favorite = models.Favorite;

/**
 * Class Definition for the Favorite Object
 * 
 * @export
 * @class Favorite
 */
export default class Favorite {
  /**
   * Add a recipe to user favorite
   * 
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Favorite
   */
  addToFavorite(req, res) {
    const userId = req.userId;
    const recipeId = req.params.recipeId;

    const validateUserIdError = validate.validateUserId(userId);
    if (validateUserIdError) {
      return res.status(403).json({
        success: false,
        message: validateUserIdError });
    }

    favorite
      .findOrCreate({ where: { userId, recipeId } })
      .spread((addedReceipe, created) => {
        if (created) {
          return res.status(201).json({
            success: true,
            message: `Recipe with id: ${recipeId} added to favorites!` });
        }

        return res.status(201).json({
          success: false,
          message: `Recipe with id: ${recipeId} Already added!` });
      })
      .catch(() => res.status(503).json({
        success: false,
        message: 'Error Adding Recipe to Favorites' }));

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

    const validateUserIdError = validate.validateUserId(userId);
    if (validateUserIdError) {
      return res.status(403).json({
        success: false,
        message: validateUserIdError });
    }

    const recipeId = req.params.recipeId;

    favorite
      .destroy({
        where: {
          $and: [
            { userId },
            { recipeId }
          ]
        },
      })
      .then(() => {
        res.status(204).end();
      })
      .catch(() => res.status(503).json({
        success: false,
        message: 'Error Removing Recipe from Favorites' }));

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

    favorite
      .findAll({
        where: { userId },
        include: [
          { model: models.Recipe },
          { model: models.User, attributes: ['name', 'updatedAt'] }
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
          foundRecipes });
      })
      .catch(() => res.status(503).json({
        success: false,
        message: 'Unable to fetch favorite recipes' }));

    return this;
  }
}
