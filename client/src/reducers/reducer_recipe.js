import { RECIPE } from '../constants';

let recipe = {
  id: null,
  name: ''
};

export default (state = recipe, action) => {
  switch (action.type) {
    case RECIPE:
      const { newRecipe } = action;
      recipe = newRecipe;
      return recipe;
    default:
      return state;
  }
}
