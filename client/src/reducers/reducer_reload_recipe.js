import { RECIPES } from '../constants';

let reload = false;

export default (state = reload, action) => {
  switch (action.type) {
    case RECIPES:
      const { reloadRecipes } = action;
      reload = reloadRecipes;
      return reload;
    default:
      return state;
  }
}
