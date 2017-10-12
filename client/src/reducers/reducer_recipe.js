import { RECIPE_ID } from '../constants';

let recipeId = null;

export default (state = recipeId, action) => {
  switch (action.type) {
    case RECIPE_ID:
      const { newRecipeId } = action;
      recipeId = newRecipeId;
      return recipeId;
    default:
      return state;
  }
}
