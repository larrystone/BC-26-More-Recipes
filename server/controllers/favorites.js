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
    .catch(() => res.status(401).send({ error: 'Error Recipe to Favorites' }));

  return newFavorite;
};

export const removeFromFavorite = () => {

};
