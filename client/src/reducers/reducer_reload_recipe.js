import { RELOAD } from '../constants';

let reload = false;

export default (state = reload, action) => {
  if (action.type === RELOAD) {
    const { reloadRecipes } = action;
    reload = reloadRecipes;
    return reload;
  }
  return state;
};
