import axios from 'axios';
import jwt from 'jsonwebtoken';
import setToken from '../utils/setToken';
import { SET_CURRENT_USER, SET_USER_PROFILE } from '../constants';

const url = '/api/v1/users/';

/**
 * Sets the current user in the store
 *
 * @export
 * @param {any} userData
 * @returns {obj} action
 */
export function setCurrentUser(userData) {
  return {
    type: SET_CURRENT_USER,
    userData
  };
}

/**
 * Signs out a user
 *
 * @export
 * @returns {obj} promise
 */
export function signOut() {
  return (dispatch) => {
    localStorage.removeItem('token');
    setToken(false);
    dispatch(setCurrentUser({}));
    window.location.reload();
  };
}

/**
 * Signs in a user
 *
 * @export
 * @param {any} userData
 * @returns {obj} promise
 */
export function signIn(userData) {
  return dispatch => axios.post(`${url}signin`, userData)
    .then((response) => {
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      dispatch(setCurrentUser(jwt.decode(localStorage.getItem('token'))));
    });
}

/**
 * Signs up a user
 *
 * @export
 * @param {any} userData
 * @returns {obj} promise
 */
export function signUp(userData) {
  return dispatch => axios.post(`${url}signup`, userData)
    .then((response) => {
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      dispatch(setCurrentUser(jwt.decode(localStorage.getItem('token'))));
    });
}

/**
 * Get User information and stats
 *
 * @export
 * @param {number} userId - User ID
 * @returns {object} action
 */
export function getUser(userId) {
  return dispatch =>
    axios.get(`${url}${userId}/profile`)
      .then((response) => {
        const { data: { user } } = response;
        dispatch({
          type: SET_USER_PROFILE,
          user
        });
      });
}
