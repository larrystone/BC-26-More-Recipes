import axios from 'axios';
import _ from 'lodash';

import {
  SET_PAGED_RECIPE, SET_MY_RECIPES, SET_CURRENT_RECIPE,
  DELETE_RECIPE, ADD_RECIPE, EDIT_RECIPE
} from '../constants';

const url = '/api/v1/recipes';
/**
 * @description - Sets paginated recipe in the store
 *
 * @export
 *
 * @param {object} recipes - Recipe details
 *
 * @returns {object} action - Page action
 */
export function setPaginatedRecipes(recipes) {
  return {
    type: SET_PAGED_RECIPE,
    recipes
  };
}

/**
 * @description - Fetch paginated recipes asynchronously
 *
 * @export
 *
 * @param {Number} page - Page to fetch
 *
 * @param {Number} limit - Limit of results
 *
 * @returns {object} dispatch - Dispatched action
 */
export function fetchPagedRecipe(page, limit) {
  return dispatch =>
    axios
      .get(`${url}?sort=upvotes&order=descending&limit=${limit}&page=${page}`)
      .then((response) => {
        const { recipes, pagination } = response.data;
        dispatch(setPaginatedRecipes({
          recipes: _.mapKeys(recipes, 'id'), pagination
        }));
      });
}

/**
 * @description - Search for recipe (paginated)
 *
 * @export
 *
 * @param {string} searchCategory - Category of search
 *
 * @param {string} searchString - Search string
 *
 * @param {string} page - Page to fetch
 *
 * @param {string} limit - Limit of results
 *
 * @returns {object} dispatch - Dispatched action
 */
export function searchRecipe(searchCategory, searchString, page, limit) {
  return dispatch =>
    axios.get(`${url}?${searchCategory}=${searchString}` +
      `&limit=${limit}&page=${page}`)
      .then((response) => {
        const { recipes, pagination } = response.data;
        dispatch(setPaginatedRecipes({
          recipes: _.mapKeys(recipes, 'id'), pagination
        }));
      })
      .catch(() => {
        dispatch(setPaginatedRecipes({
          recipes: {}, pagination: {}
        }));
      });
}


/**
 * @description - Search for recipe (paginated)
 *
 * @export
 *
 * @param {number} recipeId - Recipe ID
 *
 * @returns {object} dispatch - Dispatched action
 */
export function fetchRecipeDetails(recipeId) {
  return dispatch =>
    axios.get(`${url}/${recipeId}`)
      .then((response) => {
        const { data: { recipe } } = response;
        dispatch({
          type: SET_CURRENT_RECIPE,
          recipe
        });
      });
}

/**
 * @description - Fetch paginated my recipes asynchronously
 *
 * @export
 *
 * @param {Number} page - Page to fetch
 *
 * @param {Number} limit - Limit of results
 *
 * @returns {object} dispatch - Dispatched action
 */
export function fetchMyRecipes(page, limit) {
  return dispatch =>
    axios
      .get(`/api/v1/users/myRecipes?limit=${limit}&page=${page}`)
      .then((response) => {
        const { recipes, pagination } = response.data;
        dispatch({
          type: SET_MY_RECIPES,
          recipes: {
            recipes: _.mapKeys(recipes, 'id'),
            pagination
          }
        });
      });
}


/**
 * @description - Removes a recipe from user favorites
 *
 * @export
 *
 * @param {Number} recipeId - Recipe ID
 *
 * @returns {object} dispatch - Dispatched action
 */
export function deleteRecipe(recipeId) {
  return dispatch => axios.delete(`${url}/${recipeId}`)
    .then(() => {
      dispatch({
        type: DELETE_RECIPE,
        id: recipeId
      });
    });
}

/**
 * @description - Create a new recipe
 *
 * @export
 *
 * @param {object} recipeData - Recipe details
 *
 * @returns {object} dispatch - Dispatched action
 */
export function addRecipe(recipeData) {
  return dispatch => axios.post(`${url}`, recipeData)
    .then((response) => {
      const { recipe } = response.data;
      dispatch({
        type: ADD_RECIPE,
        recipe
      });
    });
}


/**
 * @description - Edit a recipe
 *
 * @export
 *
 * @param {number} recipeId - Recipe ID
 *
 * @param {object} recipeData - Recipe details
 *
 * @returns {object} dispatch - Dispatched action
 */
export function editRecipe(recipeId, recipeData) {
  return dispatch => axios.put(`${url}/${recipeId}`, recipeData)
    .then((response) => {
      const { recipe } = response.data;
      dispatch({
        type: EDIT_RECIPE,
        recipe
      });
    });
}
