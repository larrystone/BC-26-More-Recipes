import { Recipe } from '../models';

export const doExist = ({ params }, res, next) => {
  const recipeId = params.recipeId;

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
