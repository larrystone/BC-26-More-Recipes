import models from '../models';

const recipe = models.Recipe;

/**
 * @exports createRecipe
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const createRecipe = (req, res) => {
  const name = req.body.name;
  const ingredientsString = req.body.ingredients
    .replace('[\'', '').replace('\']', '');
  const ingredients = ingredientsString.split('\',\'') || [];
  const direction = req.body.direction || '';
  const newUser = recipe
    .create({
      name,
      ingredients,
      direction,
      userId: req.userId
    })
    .then((createdRecipe) => {
      res.status(201).send(createdRecipe);
    })
    .catch(() => res.status(401).send({ error: 'Error Creating Recipe' }));

  return newUser;
};

/**
 * @exports getUserRecipes
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const getUserRecipes = (req, res) => {
  const recipes = recipe
    .findAll({
      where: { userId: req.userId }
    })
    .then((foundRecipes) => {
      if (!foundRecipes) {
        return res.status(201).send({
          message: 'No User Stored Recipes found',
        });
      }

      return res.status(201).send(foundRecipes);
    })
    .catch(() => res.status(401).send('Unable to get user recipes'));

  return recipes;
};

/**
 * @exports getAllRecipes
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const getAllRecipes = (req, res) => {
  const recipes = recipe
    .findAll({
      include: [
        { model: models.User, attributes: ['name'] }
      ]
    })
    .then((foundRecipes) => {
      if (!foundRecipes) {
        return res.status(201).send({
          message: 'No Stored Recipes found',
        });
      }

      return res.status(201).send(foundRecipes);
    })
    .catch(e => res.status(401).send(`Unable to fetch recipes ${e.message}`));

  return recipes;
};


/**
 * @exports modifyRecipe
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const modifyRecipe = (req, res) => {
  const recipeId = req.params.recipeId;
  const userId = req.userId;
  const name = req.body.name;
  const ingredientsString = req.body.ingredients
    .replace('[\'', '').replace('\']', '');
  const ingredients = ingredientsString.split('\',\'') || [];
  // const ingredients = req.body.ingredients.split(';;') || [];
  const direction = req.body.direction || '';
  const modifiedRecipe = recipe
    .findById(recipeId)
    .then((recipeFound) => {
      if (!recipeFound) {
        return res.status(404).send({
          error: `No matching recipe with id: ${recipeId}`,
        });
      }

      if (recipeFound.userId !== userId) {
        return res.status(401).send({
          error: 'You cannot modify this recipe',
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
        .then((result) => {
          res.status(201).send(result[1]);
        });
    })
    .catch(() => res.status(401).send({ error: 'Error Modifying Recipe' }));

  return modifiedRecipe;
};

/**
 * @exports deleteRecipe
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const deleteRecipe = (req, res) => {
  const recipeId = req.params.recipeId;
  const userId = req.userId;
  const deletedRecipe = recipe
    .findById(recipeId)
    .then((recipeFound) => {
      if (!recipeFound) {
        return res.status(404).send({
          error: `No matching recipe with id: ${recipeId}`,
        });
      }

      if (recipeFound.userId !== userId) {
        return res.status(401).send({
          error: 'You cannot delete this recipe',
        });
      }

      recipe.destroy({
        where: {
          id: recipeId
        },
      })
        .then(() => {
          res.status(204).end();
        });
    })
    .catch(() => res.status(401).send({ error: 'Error Deleting Recipe' }));

  return deletedRecipe;
};
