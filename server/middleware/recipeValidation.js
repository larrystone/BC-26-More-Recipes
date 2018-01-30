import { Recipe } from '../models';

/**
 * @description - Checks if a recipe exists in the database
 *
 * @param {object} req -  HTTP request
 *
 * @param {object} res - HTTP response
 *
 * @param {function} next - HTTP next function
 *
 * @returns {object} response - Status of request
 */
export default ({ params }, res, next) => {
  const { recipeId } = params;
  Recipe
    .findById(recipeId)
    .then((recipe) => {
      if (recipe) {
        next();
      } else {
        res.status(404).json({
          success: false,
          message: 'Recipe does not exist!'
        });
      }
    });
};
