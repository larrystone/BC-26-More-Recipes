import { RELOAD } from '../constants';

let reload = false;

export default (state = reload, action) => {
  switch (action.type) {
    case RELOAD:
      const { reloadRecipes } = action;
      reload = reloadRecipes;
      return reload;
    default:
      return state;
  }
}
