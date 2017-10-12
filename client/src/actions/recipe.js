import { RECIPE_ID } from '../constants';

export const setRecipeId = (newRecipeId) => {
  const action = {
    type: RECIPE_ID,
    newRecipeId
  }
  return action;
}