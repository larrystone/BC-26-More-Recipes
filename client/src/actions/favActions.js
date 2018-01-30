import axios from 'axios';
import _ from 'lodash';

import {
  REMOVE_FAV, SET_MY_FAVS, SET_IS_FAV
} from '../constants';

const url = '/api/v1/users';

/**
 * @description - Removes a recipe from user favorites
 *
 * @export
 *
 * @param {Number} recipeId - Recipe ID
 *
 * @returns {object} dispatch - Dispatched action
 */
export function addFav(recipeId) {
  return dispatch => axios.post(`${url}/recipes/${recipeId}`)
    .then(() => {
      dispatch({
        type: SET_IS_FAV,
        isFav: true
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
 * @param {Number} userId - User ID
 *
 * @returns {object} dispatch - Dispatched action
 */
export function removeFav(recipeId) {
  return dispatch => axios.delete(`${url}/recipes/${recipeId}`)
    .then(() => {
      dispatch({
        type: REMOVE_FAV,
        id: recipeId
      });
    });
}

/**
 * @description - Fetch paginated my recipes asynchronously
 *
 * @export
 *
 * @param {Number} userId - User ID
 *
 * @returns {object} dispatch - Dispatched action
 */
export function fetchFavorites(userId) {
  return dispatch =>
    axios.get(`/api/v1/users/${userId}/recipes`)
      .then((response) => {
        const { recipes } = response.data;
        dispatch({
          type: SET_MY_FAVS,
          recipes: _.mapKeys(recipes, 'id')
        });
      });
}

/**
 * @description - Check if recipe is in favorite list
 *
 * @export
 *
 * @param {Number} recipeId - Recipe ID
 *
 * @returns {object} dispatch - Dispatched action
 */
export function fetchSingleFavorite(recipeId) {
  return dispatch =>
    axios.get(`/api/v1/users/recipes/${recipeId}`)
      .then((response) => {
        const { recipe } = response.data;
        dispatch({
          type: SET_IS_FAV,
          isFav: _.size(recipe) > 0
        });
      })
      .catch(() => {
        dispatch({
          type: SET_IS_FAV,
          isFav: false
        });
      });
}
