import models from '../models';
import * as validate from '../middleware/validate';
import * as Search from './searchRecipe';

const recipe = models.Recipe;
const trimWhiteSpaces = param => (param || '')
  .replace(/\s+/g, ' ');

/**
 * Class Definition for the Recipe Object
 *
 * @export
 * @class Recipe
 */
export default class Recipe {
  /**
   * Create a new recipe record
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} - Class instance
   * @memberof Recipe
   */
  createRecipe(req, res) {
    const name = trimWhiteSpaces(req.body.name);
    const ingredients = trimWhiteSpaces(req.body.ingredients);
    const direction = trimWhiteSpaces(req.body.direction);

    const validateRecipeError =
    validate.validateRecipeDetails(name, ingredients, direction);

    if (validateRecipeError) {
      return res.status(401).json({
        success: false,
        message: validateRecipeError });
    }

    recipe
      .create({
        name,
        ingredients,
        direction,
        userId: req.userId
      })
      .then((createdRecipe) => {
        res.status(201).json({
          success: true,
          message: 'New Recipe created',
          data: createdRecipe
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Creating Recipe' }));

    return this;
  }

  /**
   * Modify recipe record
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  modifyRecipe(req, res) {
    const userId = req.userId;
    const recipeId = req.params.recipeId || 0;
    const name = trimWhiteSpaces(req.body.name);
    const ingredients = trimWhiteSpaces(req.body.ingredients);
    const direction = (req.body.direction);

    const validateRecipeError =
    validate.validateRecipeDetails(name, ingredients,
      direction, recipeId);

    if (validateRecipeError) {
      return res.status(400).json({
        success: false,
        message: validateRecipeError });
    }

    recipe
      .findById(recipeId)
      .then((recipeFound) => {
        if (!recipeFound) {
          return res.status(404).json({
            success: false,
            message: `No matching recipe with id: ${recipeId}`
          });
        }

        if (+recipeFound.userId !== +userId) {
          return res.status(401).json({
            success: false,
            message: 'You cannot modify this recipe'
          });
        }

        recipe.update({
          name,
          ingredients,
          direction
        }, {
          where: {
            id: recipeId
          },
          returning: true
        })
          .then(result => res.status(201).json({
            success: true,
            message: 'Recipe record updated',
            data: result[1]
          }));
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Modifying Recipe' }));

    return this;
  }

  /**
   * Delete Recipe record
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  deleteRecipe(req, res) {
    const recipeId = req.params.recipeId;
    const userId = req.userId;

    recipe
      .findById(recipeId)
      .then((recipeFound) => {
        if (!recipeFound) {
          return res.status(404).json({
            success: false,
            message: `No matching recipe with id: ${recipeId}`
          });
        }

        if (+recipeFound.userId !== +userId) {
          return res.status(401).json({
            success: false,
            message: 'You cannot delete this recipe'
          });
        }

        recipe.destroy({
          where: {
            id: recipeId
          },
        })
          .then(() => res.status(205).json({
            success: true,
            message: 'Recipe Deleted!'
          }));
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Deleting Recipe' }));

    return this;
  }

  /**
   * Fetch a recipe record
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  getRecipe(req, res) {
    const recipeId = req.params.recipeId;

    recipe
      .findOne({
        where: { id: recipeId },
        include: [
          { model: models.User, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((recipeFound) => {
        if (!recipeFound) {
          return res.status(404).json({
            success: false,
            message: `No matching recipe with id: ${recipeId}`
          });
        }

        return recipeFound.increment('viewCount');
      })
      .then(recipeFound => recipeFound.reload())
      .then(recipeLoaded => res.status(201).json({
        success: true,
        message: 'Recipe found',
        data: recipeLoaded
      }))
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to fetch recipes' }));

    return this;
  }

  /**
   * Fetch a list user owned recipes
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  getUserRecipes(req, res) {
    const userId = req.userId;

    recipe
      .findAll({
        where: { userId }
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res.status(404).json({
            success: true,
            message: 'No User Stored Recipes found',
          });
        }

        return res.status(201).json({
          success: true,
          message: 'User Recipes found',
          data: foundRecipes });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to get user recipes' }));

    return this;
  }

  /**
   * Fetch all recipes in the database
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  getAllRecipes(req, res) {
    const newSearch = new Search.default();

    if (req.query.sort === 'upvotes' && req.query.order === 'descending') {
      newSearch.sortMostUpvotes(req, res);
    } else if (req.query.ingredients) {
      newSearch.searchByIngredients(req, res);
    } else if (req.query.search) {
      newSearch.searchAll(req, res);
    } else {
      recipe
        .findAll({
          include: [
            { model: models.User, attributes: ['name', 'updatedAt'] }
          ]
        })
        .then((foundRecipes) => {
          if (!foundRecipes) {
            return res.status(404).json({
              success: true,
              message: 'No Stored Recipes found'
            });
          }

          return res.status(201).json({
            success: true,
            message: 'Recipes found',
            data: foundRecipes });
        })
        .catch(() => res.status(500).json({
          success: false,
          message: 'Unable to fetch recipes' }));

      return this;
    }
  }
}
