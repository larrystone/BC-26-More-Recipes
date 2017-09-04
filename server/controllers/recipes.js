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
  const ingredients = req.body.ingredients || '';
  const direction = req.body.direction || '';
  const newUser = recipe
    .create({
      name,
      ingredients,
      direction,
      userId: req.userId
    })
    .then((createdRecipe) => {
      createdRecipe.success = true;
      res.status(201).send(createdRecipe);
    })
    .catch(() => res.status(401).send({
      success: false,
      message: 'Error Creating Recipe' }));

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
          success: true,
          message: 'No User Stored Recipes found',
        });
      }

      foundRecipes.success = true;
      return res.status(201).send(foundRecipes);
    })
    .catch(() => res.status(401).send({
      success: false,
      message: 'Unable to get user recipes' }));

  return recipes;
};


/**
 * @exports sortMostUpvotes
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
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
        return res.status(201).send({
          success: true,
          message: 'No Stored Recipes found',
        });
      }

      foundRecipes.success = true;
      return res.status(201).send(foundRecipes);
    })
    .catch(() => res.status(401).send({
      success: false,
      message: 'Unable to fetch recipes' }));

  return recipes;
};


/**
 * @exports getAllRecipes
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const getAllRecipes = (req, res) => {
  if (req.query.sort === 'upvotes' && req.query.order === 'ascending') {
    sortMostUpvotes(req, res);
  } else {
    const recipes = recipe
      .findAll({
        include: [
          { model: models.User, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res.status(201).send({
            success: true,
            message: 'No Stored Recipes found'
          });
        }

        foundRecipes.success = true;
        return res.status(201).send(foundRecipes);
      })
      .catch(() => res.status(401).send({
        success: false,
        message: 'Unable to fetch recipes' }));

    return recipes;
  }
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
  const ingredients = req.body.ingredients || '';
  const direction = req.body.direction || '';
  const modifiedRecipe = recipe
    .findById(recipeId)
    .then((recipeFound) => {
      if (!recipeFound) {
        return res.status(404).send({
          success: false,
          message: `No matching recipe with id: ${recipeId}`
        });
      }

      if (+recipeFound.userId !== +userId) {
        return res.status(401).send({
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
        .then((result) => {
          result[1].success = true;
          res.status(201).send(result[1]);
        });
    })
    .catch(() => res.status(401).send({
      success: false,
      message: 'Error Modifying Recipe' }));

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
          success: false,
          message: `No matching recipe with id: ${recipeId}`
        });
      }

      if (+recipeFound.userId !== +userId) {
        return res.status(401).send({
          success: false,
          message: 'You cannot delete this recipe'
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
    .catch(() => res.status(401).send({
      success: true,
      message: 'Error Deleting Recipe' }));

  return deletedRecipe;
};
