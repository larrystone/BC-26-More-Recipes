import { RECIPE } from '../constants';

let recipe = {
  id: null,
  name: ''
};

export default (state = recipe, action) => {
  if (action.type === RECIPE) {
    const { newRecipe } = action;
    return Object.assign({}, state, newRecipe);
  }
  return state;
};
