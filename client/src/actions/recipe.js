import { RECIPE } from '../constants';

export const setRecipe = (newRecipe) => {
  const action = {
    type: RECIPE,
    newRecipe
  }
  return action;
}