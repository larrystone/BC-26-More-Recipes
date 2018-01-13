import _ from 'lodash';

import {
  SET_PAGED_RECIPE,
  SET_CURRENT_RECIPE,
  SET_MY_RECIPES,
  DELETE_RECIPE,
  UPVOTE,
  DOWNVOTE,
  ADD_RECIPE,
  EDIT_RECIPE
} from '../constants';

const initialState = {
  allRecipes: {
    recipes: {},
    pagination: {}
  },
  myRecipes: {
    recipes: {},
    pagination: {}
  },
  currentRecipe: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PAGED_RECIPE:
      return { ...state, allRecipes: action.recipes };
    case SET_MY_RECIPES:
      return { ...state, myRecipes: action.recipes };
    case SET_CURRENT_RECIPE:
      return { ...state, currentRecipe: action.recipe };
    case DELETE_RECIPE:
      return {
        ...state,
        myRecipes: {
          pagination: {
            ...state.myRecipes.pagination,
            totalRecords: state.myRecipes.pagination.totalRecords - 1
          },
          recipes: _.omit(state.myRecipes.recipes, action.id)
        }
      };
    case UPVOTE:
      return {
        ...state,
        currentRecipe: {
          ...state.currentRecipe,
          upvotes: action.recipe.upvotes,
          downvotes: action.recipe.downvotes
        }
      };
    case DOWNVOTE:
      return {
        ...state,
        currentRecipe: {
          ...state.currentRecipe,
          upvotes: action.recipe.upvotes,
          downvotes: action.recipe.downvotes
        }
      };
    case ADD_RECIPE:
      return {
        ...state,
        myRecipes: {
          pagination: {
            ...state.myRecipes.pagination,
            totalRecords: state.myRecipes.pagination.totalRecords + 1
          },
          recipes: {
            ...state.myRecipes.recipes, [action.recipe.id]: action.recipe
          }
        }
      };
    case EDIT_RECIPE:
      return {
        ...state,
        myRecipes: {
          pagination: state.myRecipes.pagination,
          recipes: {
            ...state.myRecipes.recipes, [action.recipe.id]: action.recipe
          }
        }
      };
    default: return state;
  }
};
