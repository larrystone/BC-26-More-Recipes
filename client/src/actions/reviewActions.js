import axios from 'axios';

import { SET_RECIPE_REVIEWS, ADD_REVIEW } from '../constants';

const url = '/api/v1/recipes';
/**
 * @description - Sets currently viewed recipe reviews
 *
 * @export
 *
 * @param {object} reviews - Reviews object
 *
 * @returns {object} action - review action
 */
export function setReviews(reviews) {
  return {
    type: SET_RECIPE_REVIEWS,
    reviews
  };
}

/**
 * @description - Fetch reviews for a recipe
 *
 * @export
 *
 * @param {number} recipeId - Recipe ID
 *
 * @returns {object} dispatch - Dispatched action
 */
export function fetchRecipeReviews(recipeId) {
  return dispatch =>
    axios.get(`${url}/${recipeId}/reviews`)
      .then((response) => {
        const { reviews } = response.data;
        dispatch(setReviews(reviews));
      })
      .catch(() => {
        dispatch(setReviews([]));
      });
}

/**
 * @description - Post a review for a recipe
 *
 * @export
 *
 * @param {number} recipeId - Recipe ID
 *
 * @param {object} reviewData - Review Details
 *
 * @returns {object} action
 */
export function addRecipeReview(recipeId, reviewData) {
  return dispatch =>
    axios.post(`${url}/${recipeId}/reviews`, reviewData)
      .then((response) => {
        const { createdReview } = response.data;
        dispatch({
          type: ADD_REVIEW,
          review: createdReview
        });
      });
}
