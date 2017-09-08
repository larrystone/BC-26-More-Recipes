import models from '../models';
import * as validate from '../middleware/validate';

const recipe = models.Recipe;
const user = models.User;

/** Create a new recipe record
 * @exports createRecipe
 * @param  {object} req - request
 * @param  {object} res - response
 * @return {object} The created recipe
 */
export const createRecipe = (req, res) => {
  const name = (req.body.name || '').replace(/\s\s+/g, ' ');
  const ingredients = (req.body.ingredients || '').replace(/\s+/g, ' ');
  const direction = (req.body.direction || '').replace(/\s+/g, ' ');

  const validateRecipeError =
    validate.validateRecipeDetails(name, ingredients, direction);

  if (validateRecipeError) {
    return res.status(403).json({
      success: false,
      message: validateRecipeError });
  }

  const newRecipe = recipe
    .create({
      name,
      ingredients,
      direction,
      userId: req.userId
    })
    .then((createdRecipe) => {
      res.status(201).json({
        success: true,
        data: {
          id: createdRecipe.id,
          name: createdRecipe.name,
          ingredients: createdRecipe.ingredients,
          direction: createdRecipe.direction,
          userId: createdRecipe.userId
        }
      });
    })
    .catch(() => res.status(503).json({
      success: false,
      message: 'Error Creating Recipe' }));

  return newRecipe;
};

/** Modify recipe record
 * @exports modifyRecipe
 * @param  {object} req - request
 * @param  {object} res - response
 * @return {object} The modified recipe
 */
export const modifyRecipe = (req, res) => {
  const userId = req.userId;
  const recipeId = req.params.recipeId || 0;
  const name = (req.body.name || '').replace(/\s\s+/g, ' ');
  const ingredients = (req.body.ingredients || '').replace(/\s+/g, ' ');
  const direction = (req.body.direction || '').replace(/\s+/g, ' ');

  const validateRecipeError =
    validate.validateRecipeDetails(name, ingredients, direction, recipeId);

  if (validateRecipeError) {
    return res.status(403).json({
      success: false,
      message: validateRecipeError });
  }

  const modifiedRecipe = recipe
    .findById(recipeId)
    .then((recipeFound) => {
      if (!recipeFound) {
        return res.status(404).json({
          success: false,
          message: `No matching recipe with id: ${recipeId}`
        });
      }

      if (+recipeFound.userId !== +userId) {
        return res.status(403).json({
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
          data: result[1]
        }));
    })
    .catch(() => res.status(503).json({
      success: false,
      message: 'Error Modifying Recipe' }));

  return modifiedRecipe;
};

/** Delete a recipe record
 * @exports deleteRecipe
 * @param  {object} req - request
 * @param  {object} res - response
 * @return {object} The status of deletion
 */
export const deleteRecipe = (req, res) => {
  const recipeId = req.params.recipeId;
  const userId = req.userId;

  const deletedRecipe = recipe
    .findById(recipeId)
    .then((recipeFound) => {
      if (!recipeFound) {
        return res.status(404).json({
          success: false,
          message: `No matching recipe with id: ${recipeId}`
        });
      }

      if (+recipeFound.userId !== +userId) {
        return res.status(403).json({
          success: false,
          message: 'You cannot delete this recipe'
        });
      }

      recipe.destroy({
        where: {
          id: recipeId
        },
      })
        .then(() => res.status(204).end());
    })
    .catch(() => res.status(503).json({
      success: true,
      message: 'Error Deleting Recipe' }));

  return deletedRecipe;
};

/** Fetch a recipe record
 * @exports getRecipe
 * @param  {object} req - request
 * @param  {object} res - response
 * @return {object} The fetch status/found recipe
 */
export const getRecipe = (req, res) => {
  const recipeId = req.params.recipeId;

  const theRecipe = recipe
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
      data: recipeLoaded
    }))
    .catch(() => res.status(503).json({
      success: false,
      message: 'Unable to fetch recipes' }));

  return theRecipe;
};

/** Fetch a list user owned recipes
 * @exports getUserRecipes
 * @param  {object} req - request
 * @param  {object} res - response
 * @return {object} The fetch status/found recipes
 */
export const getUserRecipes = (req, res) => {
  const recipes = recipe
    .findAll({
      where: { userId: req.userId }
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
        data: foundRecipes });
    })
    .catch(() => res.status(503).json({
      success: false,
      message: 'Unable to get user recipes' }));

  return recipes;
};

/** Fetch list of recipes ordered (descending) by number of upvotes
 * @exports sortMostUpvotes
 * @param  {object} req - request
 * @param  {object} res - response
 * @return {object} The fetch status/found recipes
 */
export const sortMostUpvotes = (req, res) => {
  const recipes = recipe
    .findAll({
      include: [
        { model: models.User, attributes: ['name', 'updatedAt'] }
      ],
      order: [
        ['upvotes', 'DESC']
      ]
    })
    .then((foundRecipes) => {
      if (!foundRecipes) {
        return res.status(404).json({
          success: true,
          message: 'No Stored Recipes found',
        });
      }

      return res.status(201).json({
        success: true,
        data: foundRecipes });
    })
    .catch(() => res.status(503).json({
      success: false,
      message: 'Unable to fetch recipes' }));

  return recipes;
};

/** Fetch list of recipes based ingredients supplied
 * @exports sortMostUpvotes
 * @param  {object} req - request (req.params.ingredients)
 * @param  {object} res - response
 * @return {object} The fetch status/found recipes
 */
export const searchByIngredients = (req, res) => {
  const ingredients = req.query.ingredients.split(' ');

  const queryClause = ingredients.map(item => ({
    ingredients: { $iLike: `%${item}%` } }));

  const recipes = recipe
    .findAll({
      where: {
        $or: queryClause
      },
      include: [
        { model: models.User, attributes: ['name', 'updatedAt'] }
      ]
    })
    .then((foundRecipes) => {
      if (!foundRecipes) {
        return res.status(404).json({
          success: true,
          message: 'Nothing found',
        });
      }

      return res.status(201).json({
        success: true,
        data: foundRecipes,
      });
    })
    .catch(e => res.status(503).json({
      success: false,
      message: `Unable to search recipes ${e.message}` }));

  return recipes;
};


/** Search for recipe by Recipe name, Ingredients or Name of User
 * @exports searchAll
 * @param  {object} req - request (req.params.search)
 * @param  {object} res - response
 * @return {object} The fetch status/found recipes
 */
export const searchAll = (req, res) => {
  let results;
  const searchTerm = req.query.search;

  const recipes = recipe
    .findAll({
      where: {
        $or: [
          { name: {
            $iLike: `%${searchTerm}%` }
          },
          { ingredients: {
            $iLike: `%${searchTerm}%` }
          }
        ]
      },
      include: [
        { model: models.User, attributes: ['name', 'updatedAt'] }
      ]
    })
    .then((foundRecipes) => {
      results = foundRecipes.slice(0);
    })
    .then(() => {
      user
        .findAll({
          attributes: ['name'],
          where: {
            $or: [
              { name: {
                $iLike: `%${searchTerm}%` }
              },
              { username: {
                $iLike: searchTerm }
              },
              { email: {
                $iLike: searchTerm }
              },
            ]
          },
          include: [
            { model: models.Recipe }
          ]
        })
        .then(data => res.status(201).json({
          success: true,
          data: results.concat(data) }));
    })
    .catch(e => res.status(503).json({
      success: false,
      message: `Unable to search recipes ${e.message}` }));

  return recipes;
};


/** Fetch all recipes in the database
 * @exports getAllRecipes
 * @param  {object} req - request
 * @param  {object} res - response
 * @return {object} The fetch status/found recipes
 */
export const getAllRecipes = (req, res) => {
  if (req.query.sort === 'upvotes' && req.query.order === 'descending') {
    sortMostUpvotes(req, res);
  } else if (req.query.ingredients) {
    searchByIngredients(req, res);
  } else if (req.query.search) {
    searchAll(req, res);
  } else {
    const recipes = recipe
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
          data: foundRecipes });
      })
      .catch(() => res.status(503).json({
        success: false,
        message: 'Unable to fetch recipes' }));

    return recipes;
  }
};
