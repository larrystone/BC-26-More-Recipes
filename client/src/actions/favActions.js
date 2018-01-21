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
 * @param {Number} userId - User ID
 *
 * @returns {object} dispatch - Dispatched action
 */
export function addFav(recipeId, userId) {
  return dispatch => axios.post(`${url}/${userId}/recipes/${recipeId}`)
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
export function removeFav(recipeId, userId) {
  return dispatch => axios.delete(`${url}/${userId}/recipes/${recipeId}`)
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
 * @param {Number} userId - User ID
 *
 * @param {Number} recipeId - Recipe ID
 *
 * @returns {object} dispatch - Dispatched action
 */
export function fetchSingleFavorite(userId, recipeId) {
  return dispatch =>
    axios.get(`/api/v1/users/${userId}/recipes/${recipeId}`)
      .then((response) => {
        const { recipe } = response.data;
        dispatch({
          type: SET_IS_FAV,
          isFav: _.size(recipe) > 0
        });
      });
}
