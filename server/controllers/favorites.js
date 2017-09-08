import models from '../models';

const favorite = models.Favorite;

/** Add a recipe to user favorite
 * @exports sortMostUpvotes
 * @param  {object} req - request
 * @param  {object} res - response 
 * @return {object} The status/created favorite
 */
export const addToFavorite = (req, res) => {
  const userId = req.userId;
  const recipeId = req.params.recipeId;
  const newFavorite = favorite
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

  return newFavorite;
};


/** Remove a recipe from user favorites
 * @exports removeFromFavorites
 * @param  {object} req - request
 * @param  {object} res - response 
 * @return {object} The status
 */
export const removeFromFavorites = (req, res) => {
  const userId = req.params.userId;
  const recipeId = req.params.recipeId;
  const removeFavorite = favorite
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

  return removeFavorite;
};


/** Get a list of user's favorite recipes
 * @exports sortMostUpvotes
 * @param  {object} req - request
 * @param  {object} res - response 
 * @return {object} The status/created favorite
 */
export const getFavRecipes = (req, res) => {
  const userId = req.params.userId;
  const favRecipes = favorite
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

      foundRecipes.success = true;
      return res.status(201).send(foundRecipes);
    })
    .catch(() => res.status(503).json({
      success: false,
      message: 'Unable to fetch favorite recipes' }));

  return favRecipes;
};
