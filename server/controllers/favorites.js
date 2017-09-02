import models from '../models';

const favorite = models.Favorite;

/**
 * @exports addToFavorite
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const addToFavorite = (req, res) => {
  const userId = req.session.user.id;
  const recipeId = req.params.recipeId;
  const newFavorite = favorite
    .create({
      userId,
      recipeId
    })
    .then((createdFavorite) => {
      res.status(201).send(createdFavorite);
    })
    .catch(() => res.status(401).send({ error: 'Error Adding Recipe to Favorites' }));

  return newFavorite;
};

export const removeFromFavorite = () => {

};


/**
 * @exports getFavRecipes
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const getFavRecipes = (req, res) => {
  const userId = req.params.userId;
  const favRecipes = favorite
    .findAll({
      where: { userId },
      include: [
        { model: models.Recipe }
      ]
    })
    .then((foundRecipes) => {
      if (!foundRecipes) {
        return res.status(201).send({
          message: 'No Stored Favorite Recipes found',
        });
      }

      return res.status(201).send(foundRecipes);
    })
    .catch(e => res.status(401).send(`Unable to fetch favorite recipes ${e.message}`));

  return favRecipes;
};
