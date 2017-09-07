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
    .create({
      userId,
      recipeId
    })
    .then(createdFavorite => res.status(201).json({
      success: true,
      data: createdFavorite }))
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
  const newFavorite = favorite
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

  return newFavorite;
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
