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
  const ingredients = req.body.ingredients || [];
  const directions = req.body.directions || '';
  const newUser = recipe
    .create({
      name,
      ingredients,
      directions,
      userId: req.session.user.id
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
      where: { userId: req.session.user.id }
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
    .findAll()
    .then((foundRecipes) => {
      if (!foundRecipes) {
        return res.status(201).send({
          message: 'No Stored Recipes found',
        });
      }

      return res.status(201).send(foundRecipes);
    })
    .catch(() => res.status(401).send('Unable to fetch recipes'));

  return recipes;
};


/**
 * @exports modifyRecipe
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const modifyRecipe = (req, res) => {
  const name = req.body.name;
  const ingredients = req.body.ingredients || [];
  const directions = req.body.directions || '';
  const newRecipe = recipe
    .update({
      name,
      ingredients,
      directions
    }, {
      where: {
        userId: req.session.user.id
      }
    })
    .then((modifiedRecipe) => {
      // const createdRecipe = {
      //   recipeId: result.id,
      //   name: result.name,
      //   ingredients: result.ingredients,
      //   directions: result.directions,
      //   userId
      // };

      res.status(201).send(modifiedRecipe);
    })
    .catch(() => res.status(401).send({ error: 'Error Creating Recipe' }));

  return newRecipe;
};
