import axios from 'axios';
import _ from 'lodash';

import {
  SET_PAGED_RECIPE, SET_MY_RECIPES, SET_CURRENT_RECIPE,
  DELETE_RECIPE, ADD_RECIPE, EDIT_RECIPE
} from '../constants';

const url = '/api/v1/recipes';
/**
 * Sets paginated recipe in the store
 *
 * @export
 * @param {any} recipes
 * @returns {obj} action
 */
export function setPaginatedRecipes(recipes) {
  return {
    type: SET_PAGED_RECIPE,
    recipes
  };
}

/**
 * Fetch paginated recipes asynchronously
 *
 * @export
 * @param {any} page - Page to fetch
 * @param {any} limit - Limit of results
 * @returns {object} action
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
 * Search for recipe (paginated)
 *
 * @export
 * @param {string} searchCategory
 * @param {string} searchString
 * @param {string} page - Page to fetch
 * @param {string} limit - Limit of results
 * @returns {object} action
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
      });
}


/**
 * Search for recipe (paginated)
 *
 * @export
 * @param {number} recipeId - Limit of results
 * @returns {object} action
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
 * Fetch paginated my recipes asynchronously
 *
 * @export
 * @param {any} page - Page to fetch
 * @param {any} limit - Limit of results
 * @returns {object} action
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
 * Removes a recipe from user favorites
 *
 * @export
 * @param {any} recipeId
 * @returns {obj} promise
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
 * Create a new recipe
 *
 * @export
 * @param {any} recipeData
 * @returns {obj} promise
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
 * Edit a recipe
 *
 * @export
 * @param {number} recipeId
 * @param {object} recipeData
 * @returns {object} promise
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
