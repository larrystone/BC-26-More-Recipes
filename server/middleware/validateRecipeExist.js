import { Recipe } from '../models';

export default (req, res, next) => {
  const recipeId = req.params.recipeId;

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
    })
    .catch(() => res.status(404).json({
      success: false,
      message: 'Recipe does not exist!'
    }));
};
