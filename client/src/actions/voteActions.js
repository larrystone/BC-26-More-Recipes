import axios from 'axios';

import {
  UPVOTE, DOWNVOTE, SET_UPVOTE_LIST, SET_DOWNVOTE_LIST
} from '../constants';

const url = '/api/v1/recipes';

/**
 * @description - Upvotes a recipe
 *
 * @export
 *
 * @param {Number} recipeId - Recipe ID
 *
 * @param {Number} userId - User ID
 *
 * @returns {object} dispatch - Dispatched action
 */
export function upvote(recipeId) {
  return dispatch => axios.post(`${url}/${recipeId}/upvotes`)
    .then((response) => {
      const { recipe } = response.data;
      dispatch({
        type: UPVOTE,
        recipe
      });
    });
}

/**
 * @description - Downvotes a recipe
 *
 * @export
 *
 * @param {Number} recipeId - Recipe ID
 *
 * @param {Number} userId - User ID
 *
 * @returns {object} dispatch - Dispatched action
 */
export function downvote(recipeId) {
  return dispatch => axios.post(`${url}/${recipeId}/downvotes`)
    .then((response) => {
      const { recipe } = response.data;
      dispatch({
        type: DOWNVOTE,
        recipe
      });
    });
}

/**
 * @description - Fetch user list for recipe upvotes
 *
 * @export
 *
 * @param {Number} recipeId - Recipe ID
 *
 * @param {Number} userId - User ID
 *
 * @returns {object} dispatch - Dispatched action
 */
export function fetchUpvotes(recipeId) {
  return dispatch => axios.get(`${url}/${recipeId}/upvotes`)
    .then((/* response */) => {
      dispatch({
        type: SET_UPVOTE_LIST,
        // userId
      });
    });
}

/**
 * @description - Fetch user list for recipe downvotes
 *
 * @export
 *
 * @param {Number} recipeId - Recipe ID
 *
 * @param {Number} userId - User ID
 *
 * @returns {obj} promise
 */
export function fetchDownvotes(recipeId) {
  return dispatch => axios.get(`${url}/${recipeId}/downvotes`)
    .then((/* response */) => {
      dispatch({
        type: SET_DOWNVOTE_LIST,
        // userId
      });
    });
}

