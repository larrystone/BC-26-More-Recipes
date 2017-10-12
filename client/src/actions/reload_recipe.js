import { RELOAD } from '../constants';

export const setReloadRecipes = (reloadRecipes) => {
  const action = {
    type: RELOAD,
    reloadRecipes
  }
  return action;
}