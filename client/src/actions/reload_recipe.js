import { RECIPES } from '../constants';

export const setReloadRecipes = (reloadRecipes) => {
  const action = {
    type: RECIPES,
    reloadRecipes
  }
  return action;
}