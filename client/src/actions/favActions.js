import axios from 'axios';
import _ from 'lodash';

import {
  REMOVE_FAV, SET_MY_FAVS, SET_IS_FAV
} from '../constants';

const url = '/api/v1/users';

/**
 * Removes a recipe from user favorites
 *
 * @export
 * @param {any} recipeId
 * @param {any} userId
 * @returns {obj} promise
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
 * Removes a recipe from user favorites
 *
 * @export
 * @param {any} recipeId
 * @param {any} userId
 * @returns {obj} promise
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
 * Fetch paginated my recipes asynchronously
 *
 * @export
 * @param {any} userId - ID of user
 * @returns {object} action
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
 * Check if recipe is in favorite list
 *
 * @export
 * @param {any} userId - ID of user
 * @param {any} recipeId - ID of recipe
 * @returns {object} action
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
